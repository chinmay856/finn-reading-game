import { createRequire } from "node:module";

import { createMissionSequenceState, skipMissionPassage } from "../apps/internet-recovery/mission-sequence-state.js";
import { PLAYABLE_WALKTHROUGHS } from "../apps/internet-recovery/playable-walkthroughs.js";

const require = createRequire(import.meta.url);
const { chromium } = require(
  "/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
);

const target = process.env.FINN_CONTINUITY_TARGET
  ?? "http://127.0.0.1:5173/playable-missions.html";
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const siteIds = Object.keys(PLAYABLE_WALKTHROUGHS);
const profile = {
  activeProfileKey: "ten-site-continuity-smoke",
  profiles: {
    "ten-site-continuity-smoke": {
      completedSiteIds: [],
      createdAt: "2026-08-24T00:00:00.000Z",
      displayName: "Ten-site continuity smoke",
      missions: {},
      reflections: {},
      savedAt: "2026-08-24T00:00:00.000Z",
    },
  },
  version: 1,
};

function assetPath(source) {
  return new URL(source, target).pathname;
}

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
});
const context = await browser.newContext({ viewport: { height: 900, width: 1440 } });
await context.addInitScript((saveFile) => {
  try {
    localStorage.setItem("internet-recovery-save-files-v1", JSON.stringify(saveFile));
    sessionStorage.setItem("internet-recovery-voice-warmed-v1", "1");
  } catch {
    // Storage is unavailable on the initial blank document only.
  }
}, profile);

const page = await context.newPage();
const failures = [];
const results = [];
const failedAssets = new Set();

page.on("crash", () => failures.push("renderer crashed"));
page.on("pageerror", (error) => failures.push(`${error.name}: ${error.message}`));
page.on("console", (message) => {
  if (message.type() !== "error") return;
  const text = message.text();
  if (/Failed to load resource:.*404/iu.test(text)) return;
  failures.push(`console: ${text}`);
});
page.on("response", (response) => {
  if (response.status() < 400) return;
  const type = response.request().resourceType();
  if (!["document", "image", "media", "script", "stylesheet"].includes(type)) return;
  failedAssets.add(`${response.status()} ${type}: ${response.url()}`);
});

async function inspectVisibleSurface(label) {
  await page.evaluate(async () => {
    const pending = [...document.images]
      .filter((image) => image.getAttribute("src"))
      .map((image) => image.decode().catch(() => {}));
    await Promise.all(pending);
  });
  const findings = await page.evaluate(() => {
    const brokenImages = [...document.images]
      .filter((image) => image.getAttribute("src"))
      .filter((image) => !image.complete || image.naturalWidth === 0 || image.naturalHeight === 0)
      .map((image) => image.currentSrc || image.src || image.alt || "unnamed image");
    const stage = document.querySelector("#gameStage");
    const stageOverflow = stage
      ? {
          horizontal: stage.scrollWidth > stage.clientWidth + 1,
          vertical: stage.scrollHeight > stage.clientHeight + 1,
        }
      : null;
    return { brokenImages, stageOverflow };
  });
  for (const image of findings.brokenImages) failures.push(`${label}: broken image ${image}`);
  if (findings.stageOverflow?.horizontal) failures.push(`${label}: game stage overflows horizontally`);
  if (findings.stageOverflow?.vertical) failures.push(`${label}: game stage overflows vertically`);
}

async function advanceStoryUntilReader(siteId) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    if (await page.locator("#readerView:not([hidden])").isVisible()) return;
    if (await page.locator("#storyOverlay:not([hidden]) #storyContinue").isVisible()) {
      await page.locator("#storyContinue").click();
      await page.waitForTimeout(40);
      continue;
    }
    if (await page.locator("#corruptionPause:not([hidden]) #corruptionContinue").isVisible()) {
      await page.locator("#corruptionContinue").click();
      await page.waitForTimeout(40);
      continue;
    }
    await page.waitForTimeout(40);
  }
  throw new Error(`${siteId}: story flow did not return to the reader`);
}

try {
  for (const siteId of siteIds) {
    const mission = PLAYABLE_WALKTHROUGHS[siteId];
    const missionUrl = new URL(target);
    missionUrl.searchParams.set("site", siteId);
    await page.goto(missionUrl.href, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.locator("#storyOverlay:not([hidden]) #storyContinue").click();
    await page.locator("#readerView:not([hidden])").waitFor({ state: "visible", timeout: 15_000 });
    await inspectVisibleSurface(`${siteId} reader 1`);

    const frames = [];
    for (let index = 0; index < mission.passages.length; index += 1) {
      await page.locator("#skipReading").click();
      await page.locator("#skipView:not([hidden])").waitFor({ state: "visible", timeout: 10_000 });
      const actual = assetPath(await page.locator("#siteFrame").getAttribute("src"));
      const expected = assetPath(mission.repairFrames[index]);
      frames.push(actual);
      if (actual !== expected) failures.push(`${siteId} passage ${index + 1}: expected ${expected}, saw ${actual}`);
      await inspectVisibleSurface(`${siteId} repair ${index + 1}`);

      if (index === mission.passages.length - 1) continue;
      await page.locator("#continueAfterSkip").click();
      await advanceStoryUntilReader(siteId);
    }

    results.push({
      finalFrame: frames.at(-1),
      frames: frames.length,
      passages: mission.passages.length,
      siteId,
    });
  }

  const replayMission = PLAYABLE_WALKTHROUGHS.viewtube;
  let replaySequence = createMissionSequenceState({
    phaseOneCount: replayMission.phaseOneCount,
    totalPassages: replayMission.passages.length,
  });
  for (let index = 0; index < 3; index += 1) {
    replaySequence = skipMissionPassage(replaySequence, { passageId: replayMission.passages[index].id }).state;
  }
  await page.evaluate(({ sequence }) => {
    const store = JSON.parse(localStorage.getItem("internet-recovery-save-files-v1"));
    const active = store.profiles[store.activeProfileKey];
    active.completedSiteIds = ["viewtube"];
    active.reflections.viewtube = { reflection: "Preserve the viewer's choice." };
    active.replays.viewtube = { sequence, updatedAt: new Date().toISOString() };
    localStorage.setItem("internet-recovery-save-files-v1", JSON.stringify(store));
  }, { sequence: replaySequence });

  await page.locator("#missionView [data-open-launcher]").click();
  await page.locator("#launcherView:not([hidden])").waitFor({ state: "visible", timeout: 10_000 });
  const replayCard = page.locator(".launcher-site.playable").filter({ hasText: "ViewTube" });
  if ((await replayCard.locator(".case-status").innerText()) !== "RECOVERED · CONTINUE REPLAY") {
    failures.push("partial replay did not expose its resumable launcher action");
  }
  await replayCard.click();
  await page.waitForTimeout(100);
  if (await page.locator("#storyOverlay:not([hidden])").isVisible()) {
    failures.push(`partial replay reopened the briefing: ${await page.locator("#storyHeading").innerText()}`);
    await page.locator("#storyContinue").click();
  }
  await page.locator("#readerView:not([hidden])").waitFor({ state: "visible", timeout: 10_000 });
  const replayFrame = assetPath(await page.locator("#siteFrame").getAttribute("src"));
  if (replayFrame !== assetPath(replayMission.repairFrames[2])) {
    failures.push("partial replay did not restore the frame after three completed passages");
  }
  const resumedPassage = await page.locator("#passage").innerText();
  if (!resumedPassage.includes(replayMission.passages[3].lines[0])) {
    failures.push("partial replay did not resume with the fourth passage");
  }

  await page.locator("#missionView .start-button").click();
  await page.locator("#newGame").click();
  await page.locator("#profileGate:not([hidden])").waitFor({ state: "visible", timeout: 10_000 });
  const newGameLocation = new URL(page.url());
  if (newGameLocation.pathname !== "/playable-missions.html" || newGameLocation.search) {
    failures.push(`new game retained a mission route: ${newGameLocation.pathname}${newGameLocation.search}`);
  }
  if (!(await page.locator("#launcherView:not([hidden])").isVisible())) {
    failures.push("new game did not return to the Recovery Browser beneath player login");
  }

  for (const asset of failedAssets) failures.push(`asset request failed: ${asset}`);
  console.log(JSON.stringify({ failures, results, target }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await page.close().catch(() => {});
  await context.close();
  await browser.close();
}
