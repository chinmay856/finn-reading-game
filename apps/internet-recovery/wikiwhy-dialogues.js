const AMY_SUPPORTIVE_URL = new URL("./art/characters/dialogue/amy-supportive.jpg", import.meta.url).href;
const AMY_EVIDENCE_URL = new URL("./art/characters/dialogue/amy-evidence.jpg", import.meta.url).href;
const AMY_SKEPTICAL_URL = new URL("./art/characters/dialogue/amy-skeptical.jpg", import.meta.url).href;
const AMY_TOOLS_URL = new URL("./art/characters/dialogue/amy-tools.jpg", import.meta.url).href;
const CHINMAY_FLUSTER_1_URL = new URL("./art/characters/dialogue/chinmay-fluster-1.jpg", import.meta.url).href;
const CHINMAY_FLUSTER_2_URL = new URL("./art/characters/dialogue/chinmay-fluster-2.jpg", import.meta.url).href;
const NON_DISMISSIBLE_DIALOGUES = new Set(["shield-intro", "shield-pass-1", "shield-pass-2"]);

export function isWikiWhyDialogDismissible(dialogId) {
  return !NON_DISMISSIBLE_DIALOGUES.has(dialogId);
}

export function getWikiWhyDialogDescriptionIds({ comparison = false, meta } = {}) {
  return [
    "dialogEyebrow",
    "dialogBody",
    meta ? "dialogMeta" : null,
    comparison ? "dialogComparison" : null,
  ].filter(Boolean).join(" ");
}

export const WIKIWHY_DIALOGUES = Object.freeze({
  "amy-warning": Object.freeze({
    action: "Keep going",
    body: "Hold on. You are fixing it—but something is still rewriting the page behind you. Keep going. I think I can trace the next change.",
    eyebrow: "BACKGROUND WRITE DETECTED",
    heading: "The repair is holding. Something else is still moving.",
    portrait: AMY_EVIDENCE_URL,
    speaker: "amy",
    title: "AMY // ENGINEER CHANNEL",
  }),
  "reverse-hack-ready": Object.freeze({
    action: "Compare versions",
    body: "Okay, tiny clarification. My AI is not supposed to keep editing after the command ends, which is why this is technically very educational.",
    eyebrow: "AUTOMATIC WRITE DETECTED · SAVED REPAIR PRESERVED",
    heading: "The AI service is still writing.",
    meta: "Writer: ai_repair_service · Command: ENDED · Write status: ACTIVE",
    portrait: CHINMAY_FLUSTER_1_URL,
    speaker: "chinmay",
    title: "CEO BROADCAST // LIVE",
  }),
  "reverse-hack-amy": Object.freeze({
    action: "Start Shield Protocol",
    body: "Finn, your saved repair is intact. The comparison proves a separate AI write is still active, so we seal the content, links, and write access next.",
    comparison: true,
    eyebrow: "READINGS SAVED · EVIDENCE SAVED",
    heading: "Your repair is preserved. The AI rewrite is not.",
    portrait: AMY_SKEPTICAL_URL,
    speaker: "amy",
    title: "AMY // ENGINEER CHANNEL",
  }),
  "shield-intro": Object.freeze({
    action: "Start repair 1 of 3",
    body: "I can hold the write path open for three clean repairs. Do those, and I can seal WikiWhy so this one stays fixed.",
    eyebrow: "NEW OBJECTIVE",
    heading: "Shield Protocol is ready.",
    portrait: AMY_TOOLS_URL,
    speaker: "amy",
    title: "AMY // ENGINEER CHANNEL",
  }),
  "shield-pass-1": Object.freeze({
    action: "Continue to repair 2",
    body: "Content verified. Two repairs remain.",
    eyebrow: "SHIELD PASS 1 OF 3",
    heading: "The recovered facts are sealed in place.",
    portrait: AMY_EVIDENCE_URL,
    speaker: "amy",
    title: "AMY // ENGINEER CHANNEL",
  }),
  "shield-pass-2": Object.freeze({
    action: "Continue to final repair",
    body: "Citations and history verified. One repair remains. The AI service is pushing against the boundary.",
    eyebrow: "SHIELD PASS 2 OF 3",
    heading: "Citations and history are sealed.",
    portrait: AMY_SUPPORTIVE_URL,
    speaker: "amy",
    title: "AMY // ENGINEER CHANNEL",
  }),
  "site-secured-amy": Object.freeze({
    action: "Open blocked-write log",
    body: "Nice work, Finn. That site is not just cleaner. It has a lock the shortcut cannot write through.",
    eyebrow: "SHIELD PROTOCOL 3 OF 3 · WRITE ACCESS",
    heading: "Write access sealed. Evidence file recovered.",
    meta: "WIKIWHY_TRACE_01.LOG · AI WRITE ROUTE / 01",
    portrait: AMY_SUPPORTIVE_URL,
    speaker: "amy",
    title: "AMY // ENGINEER CHANNEL",
  }),
  "site-secured": Object.freeze({
    action: "Return to Recovery Map",
    body: "ai_repair_service tried to modify WikiWhy and was denied because Finn restored the approval check the AI optimized away. I would like the record to show that I am also upset with my AI, although I did name the deployment ‘Definitely Fine.’",
    eyebrow: "ACCESS DENIED",
    heading: "Unauthorized AI write blocked.",
    meta: "AUTONOMOUS AI WRITE: ACCESS DENIED",
    portrait: CHINMAY_FLUSTER_2_URL,
    speaker: "chinmay",
    title: "HIDDEN ADMIN WINDOW",
  }),
});
