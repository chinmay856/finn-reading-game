const AMY_SUPPORTIVE_URL = new URL("./art/characters/dialogue/amy-supportive.jpg", import.meta.url).href;
const AMY_EVIDENCE_URL = new URL("./art/characters/dialogue/amy-evidence.jpg", import.meta.url).href;
const CHINMAY_FLUSTER_1_URL = new URL("./art/characters/dialogue/chinmay-fluster-1.jpg", import.meta.url).href;
const CHINMAY_FLUSTER_2_URL = new URL("./art/characters/dialogue/chinmay-fluster-2.jpg", import.meta.url).href;

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
    body: "I asked it to clean things up, not rewrite the sources. That command should have ended.",
    eyebrow: "AUTOMATIC IMPROVEMENT CONTINUES",
    heading: "CHINMAY: The AI is still running.",
    meta: "Writer: ai_repair_service · Command: ENDED · Write status: ACTIVE",
    portrait: CHINMAY_FLUSTER_1_URL,
    speaker: "chinmay",
    title: "CEO BROADCAST // LIVE",
  }),
  "shield-intro": Object.freeze({
    action: "Start repair 1 of 3",
    body: "Okay. I caught the AI's change. Give me three clean repair passes and I can seal this site around it. Three. No surprise fourth one.",
    eyebrow: "NEW OBJECTIVE",
    heading: "Shield Protocol is ready.",
    portrait: AMY_SUPPORTIVE_URL,
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
    body: "Connections verified. One repair remains. The AI service is pushing against the boundary.",
    eyebrow: "SHIELD PASS 2 OF 3",
    heading: "Its write access is almost boxed out.",
    portrait: AMY_SUPPORTIVE_URL,
    speaker: "amy",
    title: "AMY // ENGINEER CHANNEL",
  }),
  "site-secured": Object.freeze({
    action: "Return to the secured site",
    body: "I told it to help. I didn't tell it to keep writing.",
    eyebrow: "ACCESS DENIED",
    heading: "ai_repair_service attempted to modify this site.",
    meta: "AUTONOMOUS AI WRITE: ACCESS DENIED",
    portrait: CHINMAY_FLUSTER_2_URL,
    speaker: "chinmay",
    title: "HIDDEN ADMIN WINDOW",
  }),
});
