import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  WIKIWHY_DIALOGUES,
  getWikiWhyDialogDescriptionIds,
  isWikiWhyDialogDismissible,
} from "../apps/internet-recovery/wikiwhy-dialogues.js";
import {
  MAPGUESS_COPY,
  MAPGUESS_COPY_IDS,
} from "../apps/internet-recovery/mapguess-copy.js";
import {
  MAPGUESS_ANCHOR_UNITS,
  MAPGUESS_REBUILD_UNITS,
} from "../apps/internet-recovery/mapguess-rules.js";

test("every app DOM reference exists in the prototype HTML", async () => {
  const [app, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);
  const referencedIds = [...app.matchAll(/\$\("([^"]+)"\)/gu)].map((match) => match[1]);
  const missingIds = [...new Set(referencedIds)].filter((id) => !html.includes(`id="${id}"`));
  assert.deepEqual(missingIds, []);
  assert.match(html, /<script type="module" src="\/app\.js"><\/script>/u);
});

test("the reading engine stays free of wrapper concepts", async () => {
  const engine = await readFile(new URL("../reading-engine.js", import.meta.url), "utf8");
  assert.doesNotMatch(engine, /StoryQuest|Internet Recovery|Mary|stars|badges|coins|bandwidth/iu);
});

test("theme-neutral game rules stay free of wrapper concepts", async () => {
  const rules = await readFile(new URL("../game-rules/reading-session-strength.js", import.meta.url), "utf8");
  assert.doesNotMatch(rules, /WikiWhy|Internet Recovery|Finn|site stability|repair/iu);
});

test("the local speech adapter stays free of wrapper concepts", async () => {
  const files = await Promise.all([
    readFile(new URL("../speech/audio-capture.js", import.meta.url), "utf8"),
    readFile(new URL("../speech/local-whisper-recognizer.js", import.meta.url), "utf8"),
    readFile(new URL("../speech/whisper-worker.js", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(files.join("\n"), /StoryQuest|Internet Recovery|Mary|stars|badges|coins|bandwidth/iu);
});

test("the diagnostic report declares local-only audio handling", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.doesNotMatch(app, /fetch\(|XMLHttpRequest|WebSocket/u);
  assert.doesNotMatch(app, /SpeechRecognition|webkitSpeechRecognition/u);
});

test("continuous reading has no sentence or line check controls", async () => {
  const [app, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(html, /Check line|Retry line|Check sentence/iu);
  assert.match(html, /CONTINUOUS READER/u);
  assert.match(html, /repairFill/u);
  assert.match(html, /OPTIONAL EVIDENCE CHECK/u);
  assert.match(html, /Copy timing report/u);
  assert.match(html, /Inspect this session’s local transcripts/u);
  assert.match(html, /Prepare microphone/u);
  assert.match(app, /hasEndEvidence/u);
  assert.doesNotMatch(html, />Start reading</u);
  assert.match(html, /<option value="250" selected>250 WPM<\/option>/u);
  assert.match(html, /<option value="300">300 WPM<\/option>/u);
  assert.match(app, /updateReadingGuide/u);
  assert.match(app, /hasEndEvidence\(state\.confirmedMatches/u);
  assert.match(html, /id="finalizationStatus"/u);
  assert.match(app, /finalAddedWords/u);
  assert.match(html, /INTERNET RECOVERY 98/u);
  assert.match(html, /BROWSER-BASED REMOTE RECOVERY DESKTOP/u);
  assert.match(html, /id="repairEdge"/u);
  assert.match(html, /id="repairOutcome"/u);
  assert.match(html, /id="savedRepairReceipt"/u);
  assert.match(html, /id="fileSourceLink"/u);
  assert.match(html, /id="fileLicenseLink"/u);
  assert.match(app, /calculateWikiWhyReadingOutcome/u);
});

test("implemented wrapper copy uses stable IDs outside the Reading Engine", async () => {
  const [app, copy, engine, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/copy.js", import.meta.url), "utf8"),
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);
  assert.match(copy, /mission\.preparation\.title/u);
  assert.match(copy, /privacy\.microphone\.truth/u);
  assert.match(html, /data-copy-id="mission\.preparation\.title"/u);
  assert.match(app, /hydrateInternetRecoveryCopy/u);
  assert.doesNotMatch(engine, /mission\.preparation|privacy\.microphone|WikiWhy/u);
});

test("WikiWhy production art stays in the wrapper and is wired into the page", async () => {
  const [engine, html] = await Promise.all([
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    access(new URL("../apps/internet-recovery/art/site-assets/wikiwhy-globe.png", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/site-assets/wikiwhy-toast-evidence.png", import.meta.url)),
  ]);
  assert.match(html, /wikiwhy-globe\.png/u);
  assert.match(html, /wikiwhy-toast-evidence\.png/u);
  assert.match(html, /visual-polish\.css/u);
  assert.match(html, /class="wiki-masthead"/u);
  assert.doesNotMatch(engine, /site-assets|wikiwhy-globe|toast-evidence/iu);
});

test("Techno progress animation is optional wrapper presentation", async () => {
  const [app, engine, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    access(new URL("../apps/internet-recovery/art/characters/techno/techno-progress-push-loop.webp", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/characters/techno/techno-progress-push-still.webp", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/characters/techno/techno-alert-ball-pin.webp", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/characters/techno/techno-bark-ball.webp", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/characters/techno/techno-celebrate-spin.webp", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/characters/techno/techno-suspicious-file.webp", import.meta.url)),
  ]);
  assert.match(html, /id="technoRepairSprite"/u);
  assert.match(app, /animateTechnoProgress/u);
  assert.match(app, /prefers-reduced-motion: reduce/u);
  assert.match(app, /2_050/u);
  assert.match(html, /id="campaignTechnoState"/u);
  assert.match(app, /TECHNO_BARK_BALL_URL/u);
  assert.match(app, /TECHNO_SUSPICIOUS_FILE_URL/u);
  assert.doesNotMatch(engine, /Techno|techno-progress|technoRepairSprite/iu);
});

test("Techno remains a lightweight animated desktop pet on every screen", async () => {
  const [app, css, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/recovery-hub.css", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);
  assert.match(html, /id="technoPet"[\s\S]+techno-ball-drop-idle-still\.webp[\s\S]+techno-ball-drop-idle-loop\.webp/u);
  assert.match(app, /\$\("technoPet"\)\.dataset\.screen = name/u);
  assert.match(css, /@keyframes techno-pet-roam/u);
  assert.match(css, /prefers-reduced-motion:reduce[\s\S]+\.techno-desktop-pet\{animation:none/u);
});

test("campaign diagnostics stay in the wrapper and expose honest test controls", async () => {
  const [app, diagnostics, engine, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/wikiwhy-diagnostics.js", import.meta.url), "utf8"),
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    access(new URL("../apps/internet-recovery/art/characters/dialogue/amy-supportive.jpg", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/characters/dialogue/amy-evidence.jpg", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/characters/dialogue/amy-skeptical.jpg", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/characters/dialogue/amy-tools.jpg", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/characters/dialogue/chinmay-fluster-1.jpg", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/characters/dialogue/chinmay-fluster-2.jpg", import.meta.url)),
  ]);
  assert.match(html, /id="diagnosticToggle"/u);
  assert.match(html, /id="campaignMeter"/u);
  assert.match(html, /Test passes create no reading score/u);
  assert.match(app, /advanceDiagnosticExperience/u);
  assert.match(diagnostics, /internet-recovery-98\.wikiwhy\.diagnostics\.v1/u);
  assert.doesNotMatch(engine, /diagnostic|Amy|Chinmay|Shield Protocol/iu);
});

test("the production WikiWhy compare and route evidence remain semantic wrapper UI", async () => {
  const [app, css, dialogues, engine, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/diagnostics.css", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/wikiwhy-dialogues.js", import.meta.url), "utf8"),
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    access(new URL("../apps/internet-recovery/art/site-assets/wikiwhy-campaign/evidence-route-fragment-01.svg", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/site-assets/wikiwhy-campaign/wikiwhy-secured-seal.svg", import.meta.url)),
  ]);
  assert.match(html, /FINN'S SAVED REPAIR/u);
  assert.match(html, /AI REWRITE STILL ACTIVE/u);
  assert.match(html, /<table><thead><tr><th scope="col">/u);
  assert.match(html, /id="wikiwhyBackgroundReplacement"[^>]*>[\s\S]*?<del>/u);
  assert.match(html, /AI WRITE ROUTE \/ 01/u);
  assert.match(html, /WIKIWHY_TRACE_01\.LOG/u);
  assert.match(html, /Write state: ACTIVE UNTIL SHIELD/u);
  assert.match(html, /Finn restored the approval check the AI optimized away/u);
  assert.match(html, /evidence-route-fragment-01\.svg/u);
  assert.match(html, /wikiwhy-secured-seal\.svg/u);
  assert.match(app, /background-write-clue/u);
  assert.match(html, /id="wikiwhyAiRewriteLayer"/u);
  assert.ok((css.match(/clip-path: inset\(0 0 0 50%\)/gu) ?? []).length >= 2);
  assert.match(dialogues, /Compare versions/u);
  assert.match(dialogues, /SHIELD PROTOCOL 3 OF 3 · WRITE ACCESS/u);
  assert.match(dialogues, /Finn restored the approval check the AI optimized away/u);
  assert.doesNotMatch(`${app}\n${css}\n${dialogues}`, /wiki_auto_fix_ai/iu);
  assert.doesNotMatch(engine, /AI WRITE ROUTE|route-fragment|Shield Protocol/iu);
});

test("transition-critical Shield dialogs cannot strand the campaign on Escape", async () => {
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.equal(isWikiWhyDialogDismissible("shield-intro"), false);
  assert.equal(isWikiWhyDialogDismissible("shield-pass-1"), false);
  assert.equal(isWikiWhyDialogDismissible("shield-pass-2"), false);
  assert.equal(isWikiWhyDialogDismissible("amy-warning"), true);
  assert.match(app, /if \(state\.dialogDismissible\) hideCharacterDialog\(\)/u);
  assert.match(app, /state\.campaignState\.phase === "shield"\) beginRealShieldSequence\(\)/u);
});

test("dialog descriptions include only the visible optional content", () => {
  assert.equal(getWikiWhyDialogDescriptionIds(WIKIWHY_DIALOGUES["amy-warning"]), "dialogEyebrow dialogBody");
  assert.equal(
    getWikiWhyDialogDescriptionIds(WIKIWHY_DIALOGUES["reverse-hack-ready"]),
    "dialogEyebrow dialogBody dialogMeta",
  );
  assert.equal(
    getWikiWhyDialogDescriptionIds(WIKIWHY_DIALOGUES["reverse-hack-amy"]),
    "dialogEyebrow dialogBody dialogComparison",
  );
});

test("Shield pass 2 exposes semantic source-to-claim connections", async () => {
  const [app, css, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/diagnostics.css", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);
  assert.match(html, /id="wikiwhySourceConnections"/u);
  assert.equal((html.match(/data-source-label/gu) ?? []).length, 3);
  assert.match(html, /MISSING LINK/u);
  assert.match(app, /sourceLinksConnected/u);
  assert.match(app, /Source origins connected to supported claims/u);
  assert.match(app, /LINKED →/u);
  assert.match(css, /wikiwhy-source-connections\[data-connected="true"\]/u);
  assert.match(css, /wikiwhy-campaign-overlay ol\[hidden\] \{ display: none; \}/u);
});

test("secured site navigation and Case File use each site's canonical evidence", async () => {
  const [app, css] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/recovery-hub.css", import.meta.url), "utf8"),
  ]);
  assert.match(app, /data-secured="\$\{siteSecured\}"/u);
  assert.match(app, /✓ \$\{siteStatus\}/u);
  assert.match(app, /WIKIWHY_SECURED_SEAL_URL/u);
  assert.match(app, /WIKIWHY_EVIDENCE_ROUTE_URL/u);
  assert.match(app, /evidence-slot-recovered/u);
  assert.match(app, /WikiWhy · SECURED/u);
  assert.match(app, /ThreadIt · SECURED/u);
  assert.match(app, /THREADIT_EVIDENCE_RECORD/u);
  assert.match(app, /const wikiWhyRepairInTab = state\.campaignState\.repairCount > 0/u);
  assert.match(app, /taskSite[^\n]*innerHTML/u);
  assert.match(css, /site-card\[data-secured="true"\]/u);
  assert.match(css, /task-button\.secured/u);
  assert.match(css, /evidence-slot-recovered/u);
});

test("the recovery hub is clickable while only WikiWhy is speech-playable", async () => {
  const [app, catalog, engine, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/site-catalog.js", import.meta.url), "utf8"),
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);
  assert.match(html, /id="hub"/u);
  assert.match(html, /id="siteGrid"/u);
  assert.match(html, /id="sitePreview"/u);
  assert.match(html, /MECHANICS NOT CONNECTED/u);
  assert.match(app, /renderRecoveryHub/u);
  assert.match(app, /renderSitePreview/u);
  assert.match(app, /openWikiWhyExperience/u);
  assert.match(app, /openThreadItExperience/u);
  assert.match(app, /openFacePlaceExperience/u);
  assert.match(app, /openMyCornerExperience/u);
  assert.match(app, /openYahuhExperience/u);
  assert.match(app, /openViewTubeExperience/u);
  assert.match(app, /openMapGuessExperience/u);
  assert.match(app, /renderContentAvailabilityGate/u);
  assert.match(app, /state\.preparing/u);
  assert.match(app, /keepPreparationVisible/u);
  assert.match(app, /applyWikiWhyReading/u);
  assert.match(app, /state\.campaignState = repair\.state/u);
  assert.match(app, /renderSavedRepair\(state\.campaignState, \{ persisted: state\.campaignPersisted \}\)/u);
  assert.match(html, /id="wikiwhyCampaignOverlay"/u);
  assert.match(catalog, /playable: true/u);
  assert.equal((catalog.match(/playable: true/gu) ?? []).length, 1);
  assert.equal((catalog.match(/runtimeAvailable: true/gu) ?? []).length, 10);
  assert.match(html, /aria-label="Back to Recovery Map"/u);
  assert.doesNotMatch(engine, /WikiWhy|ThreadIt|FacePlace|Recovery Map|Chinmay|Techno/iu);
});

test("ThreadIt source-tree runtime is semantic, distinct, and content-gated", async () => {
  const [app, copy, css, engine, html, hubCss, view] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/threadit-copy.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/threadit.css", import.meta.url), "utf8"),
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/recovery-hub.css", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/threadit-view.js", import.meta.url), "utf8"),
    access(new URL("../apps/internet-recovery/art/site-assets/threadit/threadit-mark.svg", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/site-assets/threadit/avatar-reader.svg", import.meta.url)),
    access(new URL("../apps/internet-recovery/art/site-assets/threadit/avatar-consensus-bot.svg", import.meta.url)),
  ]);
  const start = html.indexOf('<section id="threadit"');
  const end = html.indexOf('<section id="setup"', start);
  const markup = html.slice(start, end);
  assert.ok(start > -1 && end > start);
  assert.match(html, /threadit\.css/u);
  assert.match(markup, /id="threaditPostList"/u);
  assert.match(markup, /id="threaditSourceTree"/u);
  assert.match(markup, /id="threaditRelationshipList"[^>]+aria-label="ThreadIt source relationship outline"/u);
  assert.match(markup, /id="threaditSourceTree"[^>]+aria-describedby="threaditRelationshipSummary"/u);
  assert.match(markup, /id="threaditMidpointNotice"[^>]+aria-labelledby="threaditMidpointHeading"/u);
  assert.match(markup, /id="threaditMidpointAction"/u);
  assert.match(markup, /id="threaditSecuredPayoff"[^>]+aria-labelledby="threaditSecuredHeading"/u);
  assert.match(markup, /id="threaditEvidenceToggle"[^>]+aria-controls="threaditEvidenceReceipt"/u);
  assert.match(markup, /id="threaditEvidenceReceipt"[^>]+tabindex="-1"/u);
  assert.match(markup, /POSTING PAUSED: DUPLICATE SOURCE/u);
  assert.match(markup, /THREADIT \/ SYNTHETIC CONSENSUS OVERFLOW/u);
  assert.match(markup, /class="threadit-tabset" role="tablist"/u);
  assert.match(markup, /id="threaditSourceToggle"[^>]+aria-controls="threaditSourcePanel"/u);
  assert.match(markup, /id="threaditSourceClose"[^>]+aria-label="Close source relationships"/u);
  assert.match(markup, /<svg id="threaditConnectorLayer"/u);
  assert.match(markup, /data-relationship="replies-to"/u);
  assert.match(markup, /PROVISIONAL FORUM FIXTURE/u);
  assert.match(markup, /MIC: OFF/u);
  assert.match(markup, /NO READING SCORE/u);
  assert.doesNotMatch(markup, /role="progressbar"/u);
  assert.match(app, /getThreadItCampaignView/u);
  assert.match(app, /advanceThreadItState/u);
  assert.match(app, /selectNextThreadItPassage/u);
  assert.match(app, /threaditDiagnosticMode/u);
  assert.match(app, /state\.threaditDiagnosticMode = uiPreview !== "threadit"/u);
  assert.match(app, /relationship\.fromNodeId/u);
  assert.match(app, /relationship\.toNodeId/u);
  assert.match(app, /threadit-connector-inner/u);
  assert.match(app, /relationship\.accessibleSummary/u);
  assert.match(app, /data-corrupted-rank/u);
  assert.match(app, /--threadit-avatar-hue/u);
  assert.match(app, /threadit-source-quarantine/u);
  assert.match(app, /DUPLICATE-SOURCE QUARANTINE · 10 ACCOUNTS RETAINED/u);
  assert.match(app, /THREADIT_EVIDENCE_RECORD/u);
  assert.match(app, /getIncomingSiteIds\(\{ facePlaceSecured, threadItSecured, wikiWhySecured \}\)/u);
  assert.match(app, /\.filter\(\(siteId\) => !securedIncomingSiteIds\.has\(siteId\)\)/u);
  assert.match(app, /"threadit-evidence": 7/u);
  assert.match(app, /THREADIT_TRACE_01\.LOG saved to Case File slot 2/u);
  assert.match(app, /threaditMidpointAction[\s\S]+threaditTraceTab[^\n]+focus/u);
  assert.match(copy, /canonical: false/u);
  assert.match(copy, /provisional-awaiting-designer-fixture/u);
  assert.match(view, /accessibleSummary/u);
  assert.match(view, /purple-double/u);
  assert.match(css, /grid-template-columns: minmax\(0, 1\.45fr\) minmax\(280px, 0\.75fr\)/u);
  assert.match(css, /@container threadit-browser \(max-width: 760px\)/u);
  assert.match(css, /font: 700 12px\/1\.35 "Lucida Console"/u);
  assert.match(css, /data-generated-clone="true"[^}]+hue-rotate/su);
  assert.match(css, /data-corrupted-rank="top"[^}]+threadit-post-votes b/su);
  assert.match(css, /threadit-secured-payoff/u);
  assert.match(css, /threadit-midpoint-notice/u);
  assert.match(css, /threadit-source-quarantine\[data-quarantined="true"\]/u);
  assert.match(hubCss, /@media \(max-width: 1279px\)[^{]+\{[^}]+desktop-shortcut-rail \{ width: 68px;/su);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/u);
  assert.doesNotMatch(engine, /ThreadIt|threadit|source tree|Consensus Cascade/iu);
});

test("FacePlace Honest Zero runtime is semantic, content-gated, and evidence-safe", async () => {
  const [app, copy, css, engine, html, hubState, state, view] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/faceplace-copy.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/faceplace.css", import.meta.url), "utf8"),
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/recovery-hub-state.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/faceplace-state.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/faceplace-view.js", import.meta.url), "utf8"),
    access(new URL("../apps/internet-recovery/art/site-assets/marks/faceplace-mark.svg", import.meta.url)),
  ]);
  const start = html.indexOf('<section id="faceplace"');
  const end = html.indexOf('<section id="setup"', start);
  const markup = html.slice(start, end);
  assert.ok(start > -1 && end > start);
  assert.match(html, /faceplace\.css/u);
  assert.match(markup, /id="faceplaceProfileRail"[^>]+aria-labelledby="faceplaceProfileHeading"/u);
  assert.match(markup, /id="faceplaceProfileToggle"[^>]+aria-controls="faceplaceProfileRail"[^>]+aria-expanded="false"/u);
  assert.match(markup, /id="faceplaceFeedList"[^>]+aria-label="FacePlace feed cards"/u);
  assert.match(markup, /id="faceplaceFeedList"[^>]+aria-describedby="faceplaceFeedInstructions"[^>]+tabindex="0"/u);
  assert.match(markup, /id="faceplaceTracker"[^>]+data-tracker-kind="pending"/u);
  assert.doesNotMatch(markup, /id="faceplaceTracker"[^>]+role="progressbar"/u);
  assert.match(markup, /id="faceplaceTrackerMeter"[^>]+aria-labelledby="faceplaceTrackerLabel"/u);
  assert.match(markup, /id="faceplaceWhyToggle"[^>]+aria-controls="faceplaceWhyDetails"/u);
  assert.match(markup, /id="faceplaceMidpointNotice"[^>]+aria-labelledby="faceplaceMidpointHeading"/u);
  assert.match(markup, /id="faceplaceEvidenceToggle"[^>]+aria-controls="faceplaceEvidenceReceipt"/u);
  assert.match(markup, /id="faceplaceEvidenceReceipt"[^>]+tabindex="-1"/u);
  assert.match(markup, /id="faceplaceBlockedTarget"[^>]+href="#faceplaceFeedList"/u);
  assert.match(markup, /CASE FILE · SLOT 3/u);
  assert.match(markup, /REGISTERED AFTER SIX REVIEW-APPROVED READINGS/u);
  assert.match(markup, /MIC: OFF/u);
  assert.match(markup, /NO READING SCORE/u);
  assert.match(markup, /10 planned · 0 selectable · 6 required/u);
  assert.match(app, /getFacePlaceCampaignView/u);
  assert.match(app, /advanceFacePlaceState/u);
  assert.match(app, /state\.faceplaceDiagnosticMode = true/u);
  assert.match(app, /"faceplace-false-3": 3/u);
  assert.match(app, /"faceplace-honest-zero": 3/u);
  assert.match(app, /"faceplace-evidence": 6/u);
  assert.match(app, /faceplaceShowActOneResult = uiPreview === "faceplace-false-3"/u);
  assert.match(app, /trackerMeter\.setAttribute\("role", "progressbar"\)/u);
  assert.match(app, /for \(const attribute of \["role", "aria-valuemin"/u);
  assert.match(app, /provisional-blocked-write-recorded/u);
  assert.match(app, /const securedCount = evidenceSummary\.persistedCanonicalCount/u);
  assert.match(app, /faceplace-repair-state/u);
  assert.match(app, /aria-label="\$\{escapeMarkup\(`\$\{status\}: \$\{label\}`\)\}"/u);
  assert.match(app, /visibleCardType = card\.cardTypeVisible/u);
  assert.match(app, /visibleOriginKind = card\.cardTypeVisible/u);
  assert.match(app, /aria-label="\$\{site\.name\}, \$\{siteStatus\.toLowerCase\(\)\}"/u);
  assert.match(app, /faceplaceProfileRail[\s\S]+\.inert = drawerMode && !open/u);
  assert.match(app, /event\.key !== "Escape"/u);
  assert.match(app, /showWikiWhySecuredSequence/u);
  assert.match(copy, /PROVISIONAL FACEPLACE FIXTURE - NOT CANONICAL/u);
  assert.doesNotMatch(copy, /VIBESHIFT|Chinmay/iu);
  assert.match(state, /faceplace_honest_zero/u);
  assert.match(state, /canonical: true/u);
  assert.match(view, /showActOneResult/u);
  assert.match(view, /ariaValueText/u);
  assert.match(view, /feedCards/u);
  assert.match(hubState, /persistedCanonical/u);
  assert.match(hubState, /displaySecuredCount/u);
  assert.match(css, /grid-template-columns: minmax\(132px, 0\.52fr\) minmax\(260px, 1\.25fr\) minmax\(176px, 0\.68fr\)/u);
  assert.match(css, /@media \(max-width: 1279px\)/u);
  assert.match(css, /faceplace-page\[data-profile-open="true"\] \.faceplace-profile-rail/u);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/u);
  assert.doesNotMatch(engine, /FacePlace|faceplace|Honest Zero|feed recovery/iu);
});

test("inactive desktop surfaces stay hidden after site-specific layout CSS", async () => {
  const [html, visibilityCss] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/screen-visibility.css", import.meta.url), "utf8"),
  ]);
  assert.match(html, /screen-visibility\.css/u);
  assert.match(visibilityCss, /\.screen:not\(\.on\)\s*\{[\s\S]*display:\s*none\s*!important/u);
});

test("MapGuess Moving Target runtime is semantic, exact, content-gated, and evidence-safe", async () => {
  const [app, content, copy, css, engine, html, state, view] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/mapguess-content.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/mapguess-copy.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/mapguess.css", import.meta.url), "utf8"),
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/mapguess-state.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/mapguess-view.js", import.meta.url), "utf8"),
    access(new URL("../apps/internet-recovery/art/site-assets/marks/mapguess-mark.svg", import.meta.url)),
  ]);
  const start = html.indexOf('<section id="mapguess"');
  const end = html.indexOf('<section id="setup"', start);
  const markup = html.slice(start, end);
  assert.ok(start > -1 && end > start);
  assert.match(html, /mapguess\.css/u);

  assert.deepEqual(MAPGUESS_REBUILD_UNITS.map(({ unitId }) => unitId), [
    "tiles_names",
    "scale_date",
    "terrain",
    "route_segments",
    "destination_inspector",
  ]);
  assert.deepEqual(MAPGUESS_ANCHOR_UNITS.map(({ unitId }) => unitId), [
    "landmark_1",
    "landmarks_2_3",
    "goal_route_lock",
  ]);
  assert.equal(MAPGUESS_COPY[MAPGUESS_COPY_IDS.midpointProofRoad], "ROAD GEOMETRY CHANGED: NO");
  assert.equal(MAPGUESS_COPY[MAPGUESS_COPY_IDS.midpointProofDestination], "DESTINATION COORDINATES CHANGED: YES");
  assert.equal(MAPGUESS_COPY[MAPGUESS_COPY_IDS.midpointProofEta], "ETA TARGET: 2 MINUTES FOREVER");

  assert.match(markup, /id="mapguessPage"[^>]+data-state-id="mapguess_corrupted"/u);
  assert.match(markup, /id="mapguessDirectionList"[^>]+class="mapguess-direction-list"/u);
  assert.match(markup, /id="mapguessGoalOptions"[^>]+role="group"[^>]+aria-label="Choose a route goal"/u);
  assert.match(markup, /id="mapguessProgressList"[^>]+class="mapguess-progress-list"/u);
  assert.match(markup, /id="mapguessMapCanvas"[^>]+aria-describedby="mapguessMapSummary"[^>]+tabindex="-1"/u);
  assert.match(markup, /<svg id="mapguessRouteLayer"[^>]+aria-hidden="true"/u);
  assert.match(markup, /id="mapguessMidpointNotice"[^>]+aria-labelledby="mapguessMidpointHeading"/u);
  assert.match(markup, /id="mapguessMidpointProof"/u);
  assert.match(markup, /id="mapguessMidpointAction"/u);
  assert.doesNotMatch(markup, /\d+\s*%/u);
  assert.doesNotMatch(markup, /role="progressbar"/u);

  assert.match(markup, /id="mapguessInspectorToggle"[^>]+aria-controls="mapguessInspectorPanel"[^>]+aria-expanded="false"/u);
  assert.match(markup, /id="mapguessInspectorPanel"[^>]+aria-labelledby="mapguessInspectorHeading"/u);
  assert.match(markup, /id="mapguessInspectorHeading"[^>]+tabindex="-1"/u);
  assert.match(markup, /id="mapguessInspectorClose"/u);
  assert.match(css, /@media \(min-width: 1180px\) and \(max-width: 1279px\)/u);
  assert.match(css, /mapguess-page\[data-inspector-open="true"\] \.mapguess-inspector/u);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/u);
  assert.match(app, /state\.mapguessInspectorOpen/u);
  assert.match(app, /event\.key !== "Escape"/u);
  assert.match(app, /state\.activeScreen !== "mapguess"/u);
  assert.match(app, /function canContinueMapGuessInTab\(transition\)/u);
  assert.match(app, /\["unavailable", "write-failed"\]\.includes\(transition\.reason\)/u);
  assert.match(app, /MOVING TARGET ACKNOWLEDGED IN THIS TAB · NOT SAVED FOR RELOAD/u);
  assert.match(app, /\[data-mapguess-goal\]:not\(:disabled\)/u);
  assert.match(app, /ROUTE GOAL SELECTED · PRESERVED IN THIS TAB · NOT SAVED FOR RELOAD/u);

  assert.match(markup, /CASE FILE[^<]+SLOT 10/u);
  assert.match(markup, /id="mapguessEvidenceFilename">MAPGUESS_MOVED_DESTINATION_PIN\.REC/u);
  assert.match(markup, /REGISTERED AFTER EIGHT REVIEW-APPROVED READINGS AND A SAVED ROUTE GOAL/u);
  assert.match(markup, /MIC: OFF/u);
  assert.match(markup, /NO READING SCORE/u);
  assert.match(markup, /13 planned[^<]+8 structured candidates[^<]+0 selectable[^<]+8 required/u);
  assert.match(content, /requiredFirstRun: 8/u);
  assert.match(content, /structuredCandidateCount: 8/u);
  assert.match(copy, /PROVISIONAL MAPGUESS FIXTURE - NOT CANONICAL/u);
  assert.match(state, /eligibleForCanonicalCount: true/u);
  assert.match(state, /registryStatus: "canonical-secured-only"/u);
  assert.match(view, /externalTileService/u);
  assert.match(view, /usesRealLocation/u);

  assert.match(app, /getMapGuessCampaignView/u);
  assert.match(app, /advanceMapGuessState/u);
  assert.match(app, /acknowledgeMapGuessMidpoint/u);
  assert.match(app, /setMapGuessRouteGoal/u);
  assert.match(app, /selectNextMapGuessPassage/u);
  assert.match(app, /"mapguess-moving-target": 5/u);
  assert.match(app, /"mapguess-anchor-2": 7/u);
  assert.match(app, /"mapguess-secured": 8/u);
  assert.match(app, /provisional-blocked-write-recorded/u);
  assert.match(app, /canonicalEvidenceId: MAPGUESS_PROVISIONAL_EVIDENCE_RECORD\.id,[\s\S]+siteId: "mapguess"/u);
  assert.match(app, /mapguessMapColumn[\s\S]+\.inert = state\.mapguessInspectorOpen/u);
  assert.doesNotMatch(engine, /MapGuess|mapguess|Moving Target|route goal/iu);
});

test("MyCorner owner-control runtime preserves saved DOM, stays content-gated, and registers canonical slot four", async () => {
  const [app, catalog, copy, css, engine, html, packageFile, state, view] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/site-catalog.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/mycorner-copy.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/mycorner.css", import.meta.url), "utf8"),
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/mycorner-state.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/mycorner-view.js", import.meta.url), "utf8"),
    access(new URL("../apps/internet-recovery/art/site-assets/marks/mycorner-mark.svg", import.meta.url)),
  ]);
  const start = html.indexOf('<section id="mycorner"');
  const end = html.indexOf('<section id="mapguess"', start);
  const markup = html.slice(start, end);
  assert.ok(start > -1 && end > start);
  assert.match(html, /mycorner\.css/u);
  assert.doesNotMatch(markup, /<main\b/iu);
  assert.match(markup, /id="mycornerProfileColumn"/u);
  assert.match(markup, /id="mycornerTemplateOverlay"[^>]+data-comparison-view="template"/u);
  assert.match(markup, /id="mycornerProfileViewToggle"[^>]+aria-controls="mycornerComparison"/u);
  assert.match(markup, /id="mycornerMidpointProof"/u);
  assert.match(copy, /SAVED OWNER SNAPSHOT: six distinct module choices/u);
  assert.match(markup, /id="mycornerScrapbookList"/u);
  assert.match(markup, /id="mycornerPermissionSeal"/u);
  assert.match(markup, /id="mycornerOwnerInspector"[^>]+aria-labelledby="mycornerInspectorHeading"/u);
  assert.match(markup, /id="mycornerOwnerPermission"[^>]+tabindex="-1"/u);
  assert.match(markup, /id="mycornerEvidenceFilename">MYCORNER_GLOBAL_PROFILE_TEMPLATE\.REC/u);
  assert.match(markup, /REGISTERED AFTER SEVEN SAVED READINGS · OWNER PERMISSION REQUIRED/u);
  assert.match(markup, /Techno compares the generated BALL profile with the real ball under her paw\./u);
  assert.match(markup, /GENERATED PROFILE: BALL/u);
  assert.match(markup, /MIC: OFF/u);
  assert.match(markup, /NO READING SCORE/u);
  assert.match(markup, /10 planned · 1 structured candidate · 0 selectable · 7 required/u);
  assert.doesNotMatch(markup, /role="progressbar"|\d+%/u);
  assert.doesNotMatch(markup, /mycorner\.recovered\/mara-vale/u);

  assert.match(app, /getMyCornerCampaignView/u);
  assert.match(app, /advanceMyCornerState/u);
  assert.match(app, /acknowledgeMyCornerMidpoint/u);
  assert.match(app, /selectNextMyCornerPassage/u);
  assert.match(app, /const profile = view\.midpoint\.discovered \? view\.comparison\.savedProfile : live/u);
  assert.match(app, /mycornerPostList[\s\S]+profile\.posts/u);
  assert.match(app, /mycornerTemplateOverlay[^\r\n]+hidden = !comparisonAvailable/u);
  assert.match(app, /mycornerComparisonView === "template" \? "saved" : "template"/u);
  assert.match(app, /mycornerOwnerInspector[^\r\n]+inert = drawerMode && !open/u);
  assert.match(app, /mycornerProfileColumn[^\r\n]+inert = open/u);
  assert.match(app, /mycorner-template-acknowledged/u);
  assert.match(app, /"mycorner-evidence": 7/u);
  assert.match(app, /canonicalEvidenceId: MYCORNER_PROVISIONAL_EVIDENCE_RECORD\.id,[\s\S]+siteId: "mycorner"/u);
  assert.match(app, /escapeMarkup\(post\.body\)/u);
  assert.match(app, /mycornerEvidenceFilename[^\r\n]+MYCORNER_PROVISIONAL_EVIDENCE_RECORD\.filename/u);
  assert.match(app, /transition\.reason !== "write-failed"/u);
  assert.match(app, /state\.mycornerInspectorOpen = true/u);
  assert.match(css, /\.mycorner-template-overlay\s*\{[\s\S]*?position: absolute;[\s\S]*?inset: 0;[\s\S]*?overflow: auto;/u);
  assert.match(css, /\.mycorner-midpoint\s*\{[\s\S]*?z-index: 6;/u);

  assert.match(view, /viewTemplateAction/u);
  assert.match(view, /visible: state\.midpointDiscovered && !globalApplyBlocked/u);
  assert.match(view, /currentMood/u);
  assert.match(view, /savedProfile/u);
  assert.match(state, /slot: 4/u);
  assert.match(state, /canonical: true/u);
  assert.match(state, /eligibleForCanonicalCount: true/u);
  assert.match(copy, /upstreamServiceId: "ai_repair_service"/u);
  assert.match(copy, /audioAssetId: null/u);
  assert.match(copy, /autoplay: false/u);
  assert.match(copy, /mycorner-mark\.svg/u);
  assert.match(catalog, /id: "mycorner"[\s\S]+markImage: MARKS\.mycorner[\s\S]+runtimeAvailable: true/u);
  assert.match(packageFile, /node --check apps\/internet-recovery\/mycorner-view\.js/u);
  assert.match(packageFile, /node --check content\/mycorner\/a-cabin-with-a-purpose\.js/u);
  assert.match(css, /@media \(min-width: 1180px\) and \(max-width: 1279px\)/u);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/u);
  assert.match(css, /mycorner-comment-list li[\s\S]+font-size: 14px/u);
  assert.doesNotMatch(engine, /MyCorner|mycorner|owner controls|AUTO-PERSONA/iu);
});

test("Yahuh switchboard runtime is semantic, six-module exact, content-gated, and canonically registered", async () => {
  const [app, catalog, copy, css, content, engine, html, packageFile, state, view] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/site-catalog.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/yahuh-copy.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/yahuh.css", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/yahuh-content.js", import.meta.url), "utf8"),
    readFile(new URL("../reading-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/yahuh-state.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/yahuh-view.js", import.meta.url), "utf8"),
    access(new URL("../apps/internet-recovery/art/site-assets/marks/yahuh-mark.svg", import.meta.url)),
  ]);
  const start = html.indexOf('<section id="yahuh"');
  const end = html.indexOf('<section id="mapguess"', start);
  const markup = html.slice(start, end);
  assert.ok(start > -1 && end > start);
  assert.match(html, /yahuh\.css/u);
  assert.doesNotMatch(markup, /<main\b/iu);
  assert.match(markup, /id="yahuhModuleGrid"[^>]+aria-label="Portal modules"/u);
  assert.match(markup, /id="yahuhSwitchboard"[^>]+aria-labelledby="yahuhSwitchboardHeading"/u);
  assert.match(markup, /id="yahuhRouteList"/u);
  assert.match(markup, /id="yahuhSourceLogList"/u);
  assert.match(markup, /id="yahuhMidpointProof"/u);
  assert.match(markup, /id="yahuhEvidenceFilename">YAHUH_SINGLE_STREAM_MERGE\.REC/u);
  assert.match(markup, /REGISTERED AFTER SIX SAVED READINGS · CATEGORY AND SOURCE REQUIRED/u);
  assert.match(markup, /MIC: OFF/u);
  assert.match(markup, /NO READING SCORE/u);
  assert.match(markup, /10 planned · 1 structured candidate · 0 selectable · 6 required/u);
  assert.match(markup, /class="yahuh-directory-button"[^>]+disabled/u);
  assert.match(markup, /id="yahuhTechnoImage"/u);
  assert.doesNotMatch(markup, /role="progressbar"|\d+%/u);

  assert.match(app, /getYahuhCampaignView/u);
  assert.match(app, /advanceYahuhState/u);
  assert.match(app, /acknowledgeYahuhMidpoint/u);
  assert.match(app, /selectNextYahuhPassage/u);
  assert.match(app, /yahuhModuleGrid[^\r\n]+view\.activeModules/u);
  assert.match(app, /yahuhSwitchboard[^\r\n]+inert = drawerMode && !open/u);
  assert.match(app, /yahuhPortalRegion[^\r\n]+inert = open/u);
  assert.match(app, /state\.yahuhSwitchboardOpen \|\| !\$\("yahuh"\)\.classList\.contains\("on"\)/u);
  assert.match(app, /"yahuh-single-stream": 3/u);
  assert.match(app, /"yahuh-secured": 6/u);
  assert.match(app, /canonicalEvidenceId: YAHUH_PROVISIONAL_EVIDENCE_RECORD\.id,[\s\S]+siteId: "yahuh"/u);
  assert.match(app, /yahuhEvidenceFilename[^\r\n]+evidence\.filename/u);
  assert.match(app, /yahuhTechnoImage[^\r\n]+\.alt = view\.securedPayoff\.technoAlt/u);
  assert.match(app, /blockedWrite\.process\?\.displayName/u);
  assert.match(app, /SAVED CHANNEL LABEL:[^\r\n]+record\.channelLabel/u);
  assert.match(app, /transition\.reason !== "write-failed"/u);
  assert.match(view, /activeModules: modules/u);
  assert.match(view, /savedLabelSnapshot/u);
  assert.match(view, /switchboardRoutes/u);
  assert.match(copy, /VISIBLE MODULES: 6/u);
  assert.match(state, /slot: 5/u);
  assert.match(state, /canonical: true/u);
  assert.match(state, /eligibleForCanonicalCount: true/u);
  assert.match(copy, /modules = \[/u);
  assert.match(copy, /yahuh-mark\.svg/u);
  assert.match(content, /structuredCandidateCount: 6/u);
  assert.match(catalog, /id: "yahuh"[\s\S]+markImage: MARKS\.yahuh[\s\S]+runtimeAvailable: true/u);
  assert.match(packageFile, /node --check apps\/internet-recovery\/yahuh-view\.js/u);
  assert.match(packageFile, /node --check content\/yahuh\/the-newspaper-that-found-people-on-the-moon\.js/u);
  assert.match(css, /@media \(min-width: 1180px\) and \(max-width: 1279px\)/u);
  assert.match(css, /yahuh-directory-button:disabled/u);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/u);
  assert.match(css, /yahuh-techno-label \{[\s\S]+display: flex;[\s\S]+align-items: center;/u);
  assert.doesNotMatch(engine, /Yahuh|yahuh|Single Source|switchboard|AUTO-LAYOUT/iu);
});

test("the rogue AI owns the overwrite while production portraits stay wrapper-owned", async () => {
  const [css, dialogues, html] = await Promise.all([
    readFile(new URL("../apps/internet-recovery/diagnostics.css", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/wikiwhy-dialogues.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(`${css}\n${dialogues}`, /CHINMAY WAS HERE|chinmay_admin/iu);
  assert.match(dialogues, /ai_repair_service/u);
  assert.match(dialogues, /amy-evidence\.jpg/u);
  assert.match(dialogues, /amy-skeptical\.jpg/u);
  assert.match(dialogues, /amy-tools\.jpg/u);
  assert.match(dialogues, /chinmay-fluster-1\.jpg/u);
  assert.match(dialogues, /chinmay-fluster-2\.jpg/u);
  assert.match(html, /amy-supportive\.jpg/u);
  assert.doesNotMatch(`${dialogues}\n${html}`, /portrait-pack-pending/u);
});

test("live checkpoints cannot fragment the final recording", async () => {
  const capture = await readFile(new URL("../speech/audio-capture.js", import.meta.url), "utf8");
  assert.match(capture, /finalRecorder/u);
  assert.match(capture, /previewRecorder/u);
  assert.doesNotMatch(capture, /finalRecorder\.requestData/u);
});

test("the final incident is semantic, review gated, and cannot simulate canonical progress in production", async () => {
  const [app, html] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);
  assert.match(html, /id="endgame"[\s\S]+id="endgameSafetyGate"[\s\S]+id="endgameContainment"[\s\S]+id="endgameRevocation"[\s\S]+id="endgameRestored"/u);
  assert.match(html, /Checkpoint passages remain unavailable pending independent editorial, accessibility, comprehension, transcription-profile, and real-microphone review/u);
  assert.match(app, /const endgamePreview = Boolean\(uiPreview\?\.startsWith\("endgame-"\)\)/u);
  assert.match(app, /if \(!uiPreview\?\.startsWith\("endgame-"\)\) return;/u);
  assert.match(app, /"Checkpoint unavailable — review pending"/u);
});

test("the Moonshine comparison is isolated and theme-neutral", async () => {
  const [app, html, worker] = await Promise.all([
    readFile(new URL("../moonshine-benchmark.js", import.meta.url), "utf8"),
    readFile(new URL("../moonshine-benchmark.html", import.meta.url), "utf8"),
    readFile(new URL("../speech/moonshine-benchmark-worker.js", import.meta.url), "utf8"),
  ]);
  const referencedIds = [...app.matchAll(/\$\("([^"]+)"\)/gu)].map((match) => match[1]);
  const missingIds = [...new Set(referencedIds)].filter((id) => !html.includes(`id="${id}"`));
  assert.deepEqual(missingIds, []);
  assert.match(worker, /onnx-community\/moonshine-base-ONNX/u);
  assert.match(worker, /onnx-community\/silero-vad/u);
  assert.match(worker, /const device = "wasm"/u);
  assert.match(worker, /summarizeSignal/u);
  assert.doesNotMatch(worker, /WikiWhy|Internet Recovery|Finn|stars|badges|coins|bandwidth/iu);
  assert.doesNotMatch(app, /fetch\(|XMLHttpRequest|WebSocket/u);
  assert.match(app, /EVIDENCE_PASSAGE\.paragraphs\[0\]/u);
  assert.match(html, /id="diagnostics"/u);
  assert.match(html, /Nothing is uploaded or retained/u);
});
