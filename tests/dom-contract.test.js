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

test("secured WikiWhy navigation and Case File use the canonical seal and route artifact", async () => {
  const [app, css] = await Promise.all([
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../apps/internet-recovery/recovery-hub.css", import.meta.url), "utf8"),
  ]);
  assert.match(app, /data-secured="\$\{siteSecured\}"/u);
  assert.match(app, /✓ \$\{wikiWhyStatus\}/u);
  assert.match(app, /WIKIWHY_SECURED_SEAL_URL/u);
  assert.match(app, /WIKIWHY_EVIDENCE_ROUTE_URL/u);
  assert.match(app, /evidence-slot-recovered/u);
  assert.match(app, /WikiWhy · SECURED/u);
  assert.match(app, /taskSite[^\n]*innerHTML/u);
  assert.match(css, /site-card\[data-secured="true"\]/u);
  assert.match(css, /task-button\.secured/u);
  assert.match(css, /evidence-slot-recovered/u);
});

test("the recovery hub is clickable without pretending unfinished sites are playable", async () => {
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
  assert.match(app, /renderContentAvailabilityGate/u);
  assert.match(app, /state\.preparing/u);
  assert.match(app, /keepPreparationVisible/u);
  assert.match(app, /applyWikiWhyReading/u);
  assert.match(app, /state\.campaignState = repair\.state/u);
  assert.match(app, /renderSavedRepair\(state\.campaignState, \{ persisted: state\.campaignPersisted \}\)/u);
  assert.match(html, /id="wikiwhyCampaignOverlay"/u);
  assert.match(catalog, /playable: true/u);
  assert.equal((catalog.match(/playable: true/gu) ?? []).length, 1);
  assert.match(html, /aria-label="Back to Recovery Map"/u);
  assert.doesNotMatch(engine, /WikiWhy|ThreadIt|FacePlace|Recovery Map|Chinmay|Techno/iu);
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
