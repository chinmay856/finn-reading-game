import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const script = await readFile(new URL("../playable-missions.js", import.meta.url), "utf8");
const saveProgress = await readFile(new URL("../apps/internet-recovery/playable-save-progress.js", import.meta.url), "utf8");
const walkthroughs = await readFile(new URL("../apps/internet-recovery/playable-walkthroughs.js", import.meta.url), "utf8");
const html = await readFile(new URL("../playable-missions.html", import.meta.url), "utf8");
const css = await readFile(new URL("../playable-missions.css", import.meta.url), "utf8");
const windowControls = await readFile(new URL("../public/walkthroughs/shared/recovery-window-controls-v1.svg", import.meta.url), "utf8");
const productionMasterPaths = [
  "../docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-complete-state-master-v3.svg",
  "../docs/design/screens/2026-08-16/faceplace-production/faceplace-anchor-master-v2.svg",
  "../docs/design/screens/2026-08-16/threadit-production/threadit-anchor-master-v2.svg",
  "../docs/design/screens/2026-08-17/viewtube-production/viewtube-anchor-master-v2.svg",
  "../docs/design/screens/2026-08-15/amaze-on-production/amaze-on-anchor-master-v1.svg",
  "../docs/design/screens/2026-08-15/spotty-fi-production/spotty-fi-anchor-master-v1.svg",
  "../docs/design/screens/2026-08-22/mapguess-production/mapguess-anchor-master-v2.svg",
  "../docs/design/screens/2026-08-22/mycorner-production/mycorner-anchor-master-v3.svg",
  "../docs/design/screens/2026-08-16/searchish-production/searchish-anchor-master-v3.svg",
  "../docs/design/screens/2026-08-16/yahuh-production/yahuh-anchor-master-v2.svg",
];
const productionMasters = await Promise.all(productionMasterPaths.map((source) => readFile(new URL(source, import.meta.url), "utf8")));

function visibleSvgText(source) {
  return [...source.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gu)]
    .map((match) => match[1].replace(/<[^>]+>/gu, " "))
    .join(" ");
}

test("playable wrapper uses the neutral attempt and mission sequence contracts", () => {
  assert.match(script, /new ReadingAttemptController/u);
  assert.match(script, /acceptMissionReading/u);
  assert.match(script, /recordMissionComprehension/u);
  assert.match(script, /acknowledgeMissionMidpoint/u);
  assert.match(script, /submitMissionReflection/u);
  assert.match(script, /skipMissionPassage/u);
});

test("playable wrapper preserves optional Sherpa and Whisper-final architecture", () => {
  assert.match(script, /loadPinnedSherpaRuntime/u);
  assert.match(script, /createSherpaStreamingRecognizer/u);
  assert.match(script, /new LocalWhisperRecognizer/u);
  assert.match(script, /streamingGuide/u);
  assert.match(script, /streamingGuideOverride == null[\s\S]+globalThis\.crossOriginIsolated === true/u);
});

test("comprehension, troubleshooting retention, retry, skip, and reflection controls are explicit", () => {
  assert.match(html, /QUICK CHECK · USE THE PASSAGE/u);
  assert.match(html, /id="retryReading"/u);
  assert.match(html, /id="retainTroubleshooting"/u);
  assert.match(html, /id="deleteTroubleshooting"/u);
  assert.match(html, /id="reflectionText"/u);
  assert.match(html, /id="skipReading"/u);
  assert.match(html, /NO SPEECH RESULT RECORDED/u);
  assert.doesNotMatch(html, />Accuracy</u);
  assert.match(script, /entry\.properNoun === false/u);
  assert.match(script, /normalizedPassage\.includes\(sourceSentence\)/u);
  assert.match(script, /\.slice\(0, 3\)/u);
  assert.match(script, /its definition, and its passage sentence/u);
  assert.match(script, /wordAudio\.src = entry\.audioSrc/u);
});

test("Recovery OS launcher exposes all ten playable routes", () => {
  assert.match(html, /aria-label="Internet Recovery 98"/u);
  assert.ok((html.match(/>INTERNET RECOVERY 98</gu) ?? []).length >= 3);
  assert.doesNotMatch(html, /FINN READING GAME|INTERNET RECOVERY OS/iu);
  assert.match(html, /MY<br>COMPUTER/u);
  assert.match(html, />DOCUMENTS</u);
  assert.match(html, />TRASH</u);
  assert.doesNotMatch(html, />HOME</u);
  assert.doesNotMatch(html, /FLOPPY<br>DISK/u);
  assert.match(script, /PLAYABLE_SITE_IDS[^;]+wikiwhy[^;]+threadit[^;]+faceplace[^;]+mycorner[^;]+yahuh[^;]+viewtube[^;]+amaze-on[^;]+searchish[^;]+spotty-fi[^;]+mapguess/u);
  assert.doesNotMatch(script, /DESIGN IN PROGRESS/u);
  assert.match(script, /const walkthrough = playable \? getPlayableWalkthrough\(routeId\) : null/u);
  assert.match(script, /preview\.src = playable \? walkthrough\.initialFrame/u);
  assert.doesNotMatch(script, /mycorner-current_p1\.png/u);
  assert.doesNotMatch(html, /10 CASES AVAILABLE/u);
  assert.doesNotMatch(script, /LOCKED_PREVIEWS/u);
});

test("Recovery OS launcher uses the reviewed two-row visual order", () => {
  assert.match(
    script,
    /LAUNCHER_SITE_ORDER[^;]+wikiwhy[^;]+viewtube[^;]+faceplace[^;]+threadit[^;]+yahuh[^;]+mapguess[^;]+amazeon[^;]+searchish[^;]+spottyfi[^;]+mycorner/u,
  );
});

test("walkthrough frame URLs are versioned so revised mission art bypasses stale Firebase caches", () => {
  assert.match(walkthroughs, /WALKTHROUGH_ASSET_VERSION/u);
  assert.match(walkthroughs, /\.png\?v=\$\{WALKTHROUGH_ASSET_VERSION\}/u);
});

test("MapGuess exposes the approved moving-target transition beats", () => {
  assert.match(script, /mission\.transitionBeats/u);
  assert.match(script, /function runTransitionBeat/u);
  assert.match(script, /See what moved/u);
  assert.match(script, /moving-target transition/u);
});

test("the validated v2 Techno pet drives real game states", () => {
  assert.match(html, /id="technoPet"/u);
  assert.doesNotMatch(html, /technoBubble/u);
  assert.doesNotMatch(css, /\.hatched-techno\s*\{[^}]*position:\s*fixed/su);
  assert.match(script, /setTechno\("(?:working|review|failed|jump|waiting)"/u);
  assert.match(script, /aimTechnoAt/u);
  assert.match(script, /runTechnoAcross/u);
  assert.match(script, /pet\.animate/u);
  assert.match(script, /run-right/u);
  assert.match(script, /run-left/u);
  assert.match(script, /technoPointerTimer = setTimeout[^}]+dataset\.state = "idle"/su);
  assert.match(script, /if \(event\.phase === "listening"\) playTechnoAction\("file-search"/u);
  assert.match(script, /if \(event\.phase === "auto-finish-armed" \|\| event\.phase === "finalizing"\) setTechno\("review"/u);
  assert.doesNotMatch(html, /legacyTechnoCover/u);
  assert.doesNotMatch(css, /legacy-techno-cover/u);
});

test("the over-fix remains visible before Amy and Auto confirms the site lesson separately", () => {
  assert.match(html, /id="corruptionPause"/u);
  assert.match(html, /Oh no—what did Auto do\?/u);
  assert.match(script, /setFrame\(mission\.superFrame[^;]+;\s*setTechno[^;]+;\s*await showCorruptionPause\(\);\s*await showStoryBeat\("amy"/su);
  assert.match(html, /Instructions sent to Auto\./u);
  assert.match(script, /mission\.autoLesson/u);
  assert.match(script, /previewButton\.disabled = true/u);
  assert.match(script, /previewButton\.textContent = "React to the site first"/u);
  assert.match(script, /\$\("readingCompanion"\)\.inert = true/u);
});

test("MyCorner teaches the reviewed pause-before-payment rule", () => {
  assert.match(walkthroughs, /pause before ever sending money/u);
  assert.doesNotMatch(walkthroughs, /pause on urgent money requests/u);
});

test("named local saves, completed cases, and the Windows 98 Start menu are wired", () => {
  assert.match(html, /id="profileGate"/u);
  assert.match(html, /id="profileName"/u);
  assert.match(html, /id="startMenu"/u);
  assert.match(html, /id="saveGame"/u);
  assert.match(html, /id="switchProfile"/u);
  assert.match(html, /id="newGame"/u);
  assert.match(script, /internet-recovery-save-files-v1/u);
  assert.match(script, /persistPlayableMissionSequence/u);
  assert.match(script, /restorePlayableMissionSequence/u);
  assert.match(script, /launcherMissionProgress/u);
  assert.match(saveProgress, /RECOVERY COMPLETE · PLAY AGAIN/u);
  assert.match(saveProgress, /RECOVERED · CONTINUE REPLAY/u);
  assert.match(saveProgress, /CONTINUE RECOVERY/u);
  assert.match(script, /restoreMissionProgress/u);
  assert.match(script, /\$\("newGame"\)\.addEventListener\("click", async \(\) => \{\s*await navigateToLauncher\(\);\s*openProfileGate\(\{ clearName: true \}\);/u);
  assert.match(saveProgress, /approximateProgressPercent/u);
  assert.match(script, /--recovery-fill.*progress\.percent/u);
  assert.match(html, /id="documentsWindow"/u);
  assert.match(script, /feedback_for_Auto\.txt/u);
  assert.match(script, /LESSON SAVED FOR AUTO/u);
  assert.match(script, /PLAYER’S EXPLANATION/u);
});

test("mission dialogue rotates canonical portraits and does not name the player", () => {
  assert.match(script, /SITE_PORTRAITS/u);
  assert.match(script, /amy-engineer\.jpg/u);
  assert.match(script, /amy-evidence\.jpg/u);
  assert.match(script, /chinmay-production-portraits\.png/u);
  assert.match(script, /chinmay-careless/u);
  assert.match(script, /chinmay-explaining/u);
  assert.match(script, /chinmay-fluster-1\.jpg/u);
  assert.match(script, /chinmay-fluster-2\.jpg/u);
  assert.match(script, /mission\.completionChinmay\.heading/u);
  assert.match(script, /SITE_PORTRAITS\[mission\.id\]\.reflection/u);
  assert.match(script, /auto-character-expression-sheet-v2-bluetooth\.png/u);
  assert.doesNotMatch(`${html}\n${script}`, /\bFinn\b/u);
  assert.doesNotMatch(`${html}\n${script}\n${walkthroughs}`, /\bOtto\b/u);
  assert.match(`${html}\n${script}\n${walkthroughs}`, /\bAuto\b/u);
});

test("player login warms only Whisper behind the dial-up parody and defers the heavyweight guide", () => {
  assert.match(html, /id="dialupGate"/u);
  assert.match(html, /Dialing Progress/u);
  assert.match(html, /Preparing the local voice model/u);
  assert.match(html, /No modem sound will play/u);
  assert.match(script, /await prepareOpeningVoiceModel\(\)/u);
  assert.match(script, /await whisper\.load\(\)/u);
  const openingSource = script.slice(
    script.indexOf("async function prepareOpeningVoiceModel"),
    script.indexOf("function openProfileGate"),
  );
  assert.doesNotMatch(openingSource, /loadPinnedSherpaRuntime/u);
  assert.doesNotMatch(openingSource, /createSherpaStreamingRecognizer/u);
  assert.match(script, /internet-recovery-voice-warmed-v1/u);
  assert.match(script, /Connected at 56K-ish/u);
  assert.match(html, /dialup-voice-connection-v2\.png/u);
  assert.match(html, /dialup-packet-signal/u);
  assert.match(css, /@keyframes dialup-packet/u);
  assert.match(css, /#087f88/iu);
  assert.match(html, /id="setupDesktop"/u);
  assert.match(script, /setupTask.*Dialing Progress/u);
});

test("a warmed voice model reconnects automatically inside each mission", () => {
  assert.match(script, /const shouldAutoPrepare = sessionStorage\.getItem\("internet-recovery-voice-warmed-v1"\) === "1"/u);
  assert.match(script, /if \(shouldAutoPrepare && !modelsPrepared\) void prepareModels\(\)/u);
});

test("desktop chrome uses the reviewed generated Computer, Documents, and Trash set", () => {
  assert.match(css, /recovery-icon-computer-v2\.png/u);
  assert.match(css, /recovery-icon-documents-v1\.png/u);
  assert.match(css, /recovery-icon-trash-v2\.png/u);
  assert.doesNotMatch(css, /shortcut-icon\.computer::before/u);
});

test("source introductions, Kokoro vocabulary help, and the Chinmay-then-Amy teaching handoff are explicit", () => {
  assert.match(script, /sourceIntroductionLineCount/u);
  assert.match(css, /SOURCE INTRODUCTION · READ ALOUD/u);
  assert.match(script, /local-kokoro-tts\.js/u);
  assert.match(script, /speakVocabularyCard/u);
  assert.match(script, /button\.textContent = "▶ Hear aloud"/u);
  assert.match(script, /button\.textContent = "■ Stop"/u);
  assert.doesNotMatch(script, /prepareVocabularyVoice/u);
  assert.doesNotMatch(script, /prepareVocabularyCards/u);
  assert.match(script, /"floppy-drive".*repetitions: 3/u);
  assert.match(script, /function showReflection\(\).*setTechno\("waiting", "left"\)/su);
  assert.match(script, /GOOD JOB — THE FIXES ARE LOCKED IN/u);
  assert.match(script, /showStoryBeat\(\s*"chinmay"[\s\S]+showStoryBeat\(\s*"amy"/u);
  assert.match(script, /Now it’s time to teach Auto/u);
  assert.match(script, /Write the lesson for Auto/u);
  assert.match(script, /completion: "amy-supportive"/u);
  assert.match(script, /briefing: "amy-skeptical"/u);
});

test("playtester UI keeps saves private, coaches a paragraph without enforcing length, and hides passage counts", () => {
  assert.match(html, /Write a paragraph about what Auto should remember/u);
  assert.match(html, /0 words out of 300/u);
  assert.doesNotMatch(html, /One clear sentence is enough/u);
  assert.doesNotMatch(html, /id="(?:missionName|passagePosition|skipPassagePosition|resultPassagePosition)"/u);
  assert.match(script, /savedProfiles[^\n]+replaceChildren\(\)/u);
  assert.match(script, /savedProfiles[^\n]+hidden = true/u);
  assert.doesNotMatch(script, /savedProfiles[^\n]+profiles\.map/u);
  assert.match(script, /word\$\{count === 1[^\n]+out of 300/u);
});

test("Reading Companion chrome uses the reviewed shared vector control asset", () => {
  assert.match(html, /companion-titlebar[^\n]+recovery-window-controls-v1\.svg/u);
  assert.doesNotMatch(html, /window-control minimize/u);
  assert.doesNotMatch(css, /window-control\.minimize/u);
  assert.match(windowControls, /M8 17h11/u);
  assert.match(windowControls, /x="38" y="6" width="13" height="13"/u);
  assert.match(windowControls, /m69 7 13 13m0-13-13 13/u);
});

test("reviewed mission art leaves the player unnamed and preserves only the literary Huckleberry Finn title", () => {
  for (const [index, source] of productionMasters.entries()) {
    const text = visibleSvgText(source);
    const withoutLiteraryTitle = text.replace(/Huckleberry Finn/giu, "");
    assert.doesNotMatch(withoutLiteraryTitle, /\bFinn\b/iu, productionMasterPaths[index]);
    assert.doesNotMatch(text, /\bOtto\b/iu, productionMasterPaths[index]);
  }
});

test("stability hardening avoids three-model startup and preserves local-only crash breadcrumbs", () => {
  assert.match(html, /installClientStabilityMonitor/u);
  assert.match(html, /id="downloadStabilityReport"/u);
  assert.match(script, /acquireExclusiveModelLease/u);
  assert.match(script, /Another game tab is using the live guide/u);
  assert.match(script, /recoveredFromUncleanExit/u);
  assert.match(script, /streamingGuideLease\?\.release\(\)/u);
  assert.match(script, /SHERPA_DOCUMENT_USED_KEY/u);
  assert.match(script, /navigateToMission/u);
  assert.match(script, /history\.pushState/u);
  assert.match(script, /stabilityMonitor\.report\(\)/u);
  assert.doesNotMatch(script, /void import\("\.\/speech\/local-kokoro-tts\.js"\)/u);
  assert.doesNotMatch(script, /function skipReading\(\) \{\s*void controller\?\.close\(\)/u);
});

test("Techno reads with the player and celebrates an accepted finished passage", () => {
  assert.match(script, /event\.phase === "listening"\) playTechnoAction\("file-search", "left", "idle"\)/u);
  assert.match(script, /function showResult\(readingResult\).*playTechnoAction\("data-restored", "left", "review"\)/su);
  assert.match(script, /event\.phase === "auto-finish-armed" \|\| event\.phase === "finalizing"\) setTechno\("review", "left"\)/u);
});
