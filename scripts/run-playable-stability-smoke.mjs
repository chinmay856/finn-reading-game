import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(
  "/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
);

const target = process.env.FINN_STABILITY_TARGET
  ?? "https://internet-recovery-98.web.app/playable-missions.html?site=mycorner";
const iterations = Math.max(1, Number(process.env.FINN_STABILITY_ITERATIONS) || 3);
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const profile = {
  activeProfileKey: "stability-smoke",
  profiles: {
    "stability-smoke": {
      completedSiteIds: [],
      createdAt: "2026-08-23T00:00:00.000Z",
      displayName: "Stability Smoke",
      missions: {},
      reflections: {},
      savedAt: "2026-08-23T00:00:00.000Z",
    },
  },
  version: 1,
};

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: [
    "--enable-precise-memory-info",
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
  ],
});
const context = await browser.newContext();
await context.addInitScript((saveFile) => {
  try {
    localStorage.setItem("internet-recovery-save-files-v1", JSON.stringify(saveFile));
    sessionStorage.setItem("internet-recovery-voice-warmed-v1", "1");
  } catch {
    // Storage is unavailable on the initial blank document only.
  }
}, profile);

const failures = [];
const pages = [];

function observe(page, label) {
  page.on("crash", () => failures.push(`${label}: renderer crashed`));
  page.on("pageerror", (error) => failures.push(`${label}: ${error.name}: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (/Failed to load resource:.*404/iu.test(text)) return;
    if (/sherpa-onnx\/sherpa-onnx\/(?:c-api|csrc)\//u.test(text)) return;
    failures.push(`${label}: console: ${text}`);
  });
}

async function startMission(page, label) {
  await page.goto(target, { waitUntil: "domcontentloaded", timeout: 120_000 });
  const startRecovery = page.getByRole("button", { name: "Start recovery" });
  await startRecovery.waitFor({ state: "visible", timeout: 30_000 });
  await startRecovery.click();
  await page.locator("#startReading:not([disabled])").waitFor({ state: "visible", timeout: 300_000 });
  const status = await page.locator("#modelStatus").innerText();
  const report = await page.evaluate(() => globalThis.__finnStabilityMonitor?.report?.());
  const memory = await page.evaluate(() => {
    const snapshot = performance.memory;
    return snapshot ? {
      jsHeapLimit: snapshot.jsHeapSizeLimit,
      totalJsHeap: snapshot.totalJSHeapSize,
      usedJsHeap: snapshot.usedJSHeapSize,
    } : null;
  });
  return { label, memory, report, status };
}

async function switchMissionWithoutReload(page, label) {
  await page.locator("#missionView [data-open-launcher]").click();
  await page.locator("#launcherView:not([hidden])").waitFor({ state: "visible", timeout: 10_000 });
  await page.locator(".launcher-site.playable").filter({ hasText: "MyCorner" }).click();
  const startRecovery = page.getByRole("button", { name: "Start recovery" });
  await startRecovery.waitFor({ state: "visible", timeout: 10_000 });
  await startRecovery.click();
  await page.locator("#startReading:not([disabled])").waitFor({ state: "visible", timeout: 30_000 });
  return {
    label,
    memory: await page.evaluate(() => {
      const snapshot = performance.memory;
      return snapshot ? {
        jsHeapLimit: snapshot.jsHeapSizeLimit,
        totalJsHeap: snapshot.totalJSHeapSize,
        usedJsHeap: snapshot.usedJSHeapSize,
      } : null;
    }),
    status: await page.locator("#modelStatus").innerText(),
  };
}

async function completeSyntheticReadingAttempt(page) {
  await page.locator("#startReading").click();
  await page.locator("#readerStatus").filter({ hasText: "Listening" }).waitFor({ state: "visible", timeout: 30_000 });
  await page.waitForTimeout(1_200);
  await page.locator("#finishReading").click();
  await page.locator("#resultView:not([hidden])").waitFor({ state: "visible", timeout: 120_000 });
  const firstWord = page.locator("#wordCards button").first();
  await firstWord.click();
  await page.locator("#wordAudioStatus").filter({ hasText: "Playing" }).waitFor({ state: "visible", timeout: 15_000 });
  await firstWord.click();
  return {
    result: await page.locator("#resultTitle").innerText(),
    vocabulary: await page.locator("#wordAudioStatus").innerText(),
  };
}

async function exerciseAllMissionRoutes(page) {
  const results = [];
  await page.locator("#missionView [data-open-launcher]").click();
  for (let index = 0; index < 10; index += 1) {
    const card = page.locator(".launcher-site.playable").nth(index);
    const name = await card.locator("h3").innerText();
    await card.click();
    const startRecovery = page.getByRole("button", { name: "Start recovery" });
    await startRecovery.waitFor({ state: "visible", timeout: 10_000 });
    await startRecovery.click();
    await page.locator("#readerView:not([hidden])").waitFor({ state: "visible", timeout: 10_000 });
    results.push({
      name,
      passage: await page.locator("#companionTitle").innerText(),
      passageText: (await page.locator("#passage").innerText()).slice(0, 80),
    });
    await page.locator("#missionView [data-open-launcher]").click();
    await page.locator("#launcherView:not([hidden])").waitFor({ state: "visible", timeout: 10_000 });
  }
  return results;
}

try {
  const first = await context.newPage();
  const second = await context.newPage();
  pages.push(first, second);
  observe(first, "parallel-a");
  observe(second, "parallel-b");
  // Warm the shared browser cache in the first tab before opening the second
  // reading runtime. This still exercises overlapping tabs and the Sherpa Web
  // Lock, without making a clean smoke run download two Whisper checkpoints at
  // once and mistake network contention for a renderer-stability failure.
  const parallel = [
    await startMission(first, "parallel-a"),
    await startMission(second, "parallel-b"),
  ];

  const liveGuideCount = parallel.filter(({ status }) => /live guide on/iu.test(status)).length;
  const fallbackCount = parallel.filter(({ status }) => /Whisper/iu.test(status)).length;
  if (liveGuideCount > 1) failures.push(`parallel: expected at most one Sherpa tab, found ${liveGuideCount}`);
  if (liveGuideCount + fallbackCount !== 2) failures.push("parallel: both tabs did not reach a ready voice state");

  const primaryIndex = parallel.findIndex(({ status }) => /live guide on/iu.test(status));
  const primary = primaryIndex === 1 ? second : first;
  const secondary = primary === first ? second : first;
  const primaryResult = parallel[primaryIndex < 0 ? 0 : primaryIndex];
  const readingAttempt = await completeSyntheticReadingAttempt(primary);

  await secondary.close();
  const repeated = [];
  for (let index = 0; index < iterations; index += 1) {
    repeated.push(await switchMissionWithoutReload(primary, `spa-switch-${index + 1}`));
  }

  const firstMemory = primaryResult.memory?.usedJsHeap ?? 0;
  const finalMemory = repeated.at(-1)?.memory?.usedJsHeap ?? firstMemory;
  if (firstMemory && finalMemory - firstMemory > 64 * 1024 * 1024) {
    failures.push(`spa-switch: JS heap grew by more than 64 MiB (${finalMemory - firstMemory} bytes)`);
  }

  const afterReload = await startMission(primary, "forced-reload");
  if (!/Whisper/iu.test(afterReload.status)) {
    failures.push(`forced-reload: expected memory-safe Whisper fallback, saw ${afterReload.status}`);
  }

  const missionRoutes = await exerciseAllMissionRoutes(primary);
  if (missionRoutes.length !== 10 || missionRoutes.some(({ passage, passageText }) => !passage || !passageText)) {
    failures.push("mission-routes: one or more playable missions did not reach its first passage");
  }

  const summary = {
    failures,
    iterations,
    parallel: parallel.map(({ label, memory, status }) => ({ label, memory, status })),
    repeated: repeated.map(({ label, memory, status }) => ({ label, memory, status })),
    afterReload: { memory: afterReload.memory, status: afterReload.status },
    missionRoutes,
    readingAttempt,
    target,
  };
  console.log(JSON.stringify(summary, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await Promise.all(pages.filter((page) => !page.isClosed()).map((page) => page.close().catch(() => {})));
  await context.close();
  await browser.close();
}
