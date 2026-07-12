import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import {
  WIKIWHY_DIALOGUES,
  getWikiWhyDialogDescriptionIds,
  isWikiWhyDialogDismissible,
} from "../apps/internet-recovery/wikiwhy-dialogues.js";

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
  assert.match(app, /renderContentAvailabilityGate/u);
  assert.match(app, /state\.preparing/u);
  assert.match(app, /keepPreparationVisible/u);
  assert.match(app, /applyWikiWhyReading/u);
  assert.match(app, /state\.campaignState = repair\.state/u);
  assert.match(app, /renderSavedRepair\(state\.campaignState, \{ persisted: state\.campaignPersisted \}\)/u);
  assert.match(html, /id="wikiwhyCampaignOverlay"/u);
  assert.match(catalog, /playable: true/u);
  assert.equal((catalog.match(/playable: true/gu) ?? []).length, 1);
  assert.equal((catalog.match(/runtimeAvailable: true/gu) ?? []).length, 3);
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
  assert.match(markup, /CASE FILE · SLOT 3 · PROVISIONAL TEST RECEIPT/u);
  assert.match(markup, /TEST ONLY · NOT REGISTERED FOR THE FINAL EVIDENCE UNLOCK/u);
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
  assert.match(state, /canonical: false/u);
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
