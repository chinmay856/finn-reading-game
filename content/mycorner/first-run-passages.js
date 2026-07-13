const PROFILE = Object.freeze({
  accuracyTarget: 85,
  checkpoint: Object.freeze({ audioOverlapMs: 3_000, maximumWindowMs: 16_000, minimumWindowMs: 5_000, pauseMs: 450, tokenOverlap: 12 }),
  endDetection: Object.freeze({ finalPauseMs: 900, minimumTailMatches: 6, tailSize: 10 }),
  form: "identity-and-authorship-nonfiction",
  guide: Object.freeze({ defaultWpm: 250, leadWords: 18, supportedWpm: Object.freeze([150, 200, 250, 300]) }),
  segmentation: "short-paragraphs",
  targetGrades: Object.freeze([10, 12]),
  targetWpm: Object.freeze({ comfortable: 150, stretch: 250 }),
});
const SOURCE = Object.freeze({ basis: "original-project-prose", domain: "identity-and-authorship", modificationNotice: "Original prose frozen in the canonical MyCorner first-run manuscript packet.", sourceType: "original" });
const RIGHTS = Object.freeze({ basis: "original", creditLine: "Original prose created for Finn Reading Game.", verifiedOn: "2026-07-12" });
const REVIEW = Object.freeze({ accessibility: "candidate-pending-human-review", comprehension: "candidate-pending-human-review", editorial: "candidate-pending-independent-review", factual: "candidate-pending-human-review", grade: "candidate-pending-formal-leveling", profile: "candidate-pending-real-microphone-review", rights: "candidate-pending-original-work-record-review", sensitivity: "candidate-pending-human-review", transcription: "candidate-pending-real-microphone-test" });

function candidate(id, title, paragraphs, prompt, correct, distractors, skills) {
  return Object.freeze({
    availability: "candidate", contentRevision: `${id}@2026-07-12.1`, id, title, paragraphs: Object.freeze(paragraphs),
    comprehension: Object.freeze({ prompt, choices: Object.freeze([Object.freeze({ correct: true, text: correct }), ...distractors.map((text) => Object.freeze({ correct: false, text }))]), correctFeedback: "That answer matches the distinction made in the passage.", incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue." }),
    profile: PROFILE, skills: Object.freeze(skills), source: SOURCE, rights: RIGHTS, review: REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  });
}

export const MYCORNER_FIRST_RUN_PASSAGES = Object.freeze([
  candidate("the-page-you-choose-a02", "The Page You Choose", [
    "A personal page is not a complete person. It is a set of choices about what to show, how to arrange it, and who may see it. A student might feature model buildings, favorite books, or photographs of a garden. Another interest can be equally important without appearing on the page.",
    "Selection allows expression. Color, type, order, and wording can create a tone that a generic profile form cannot capture. The owner may revise those choices as interests change. A page written at fourteen should not become a permanent template for the person at twenty.",
    "Privacy is part of authorship. Choosing an audience changes the meaning of a post. A note intended for friends may assume shared context that strangers do not have. An interface that removes the audience setting alters the owner's decision even if it preserves every word.",
    "Automated tools can suggest layouts or identify missing fields. They should not treat completion as the goal of identity. An empty music box may be deliberate, and a short biography may say exactly enough.",
    "The strongest personal page is not the one with the most modules. It is the one whose visible elements remain connected to the owner's choices. The page represents a person best when it admits that representation is selective, revisable, and controlled by the person being represented.",
  ], "Why can an empty profile module be meaningful?", "The owner may deliberately choose not to represent that part of life.", ["Every empty field proves the page is corrupted.", "Personal pages must display every interest to be accurate."], ["authorship", "privacy", "representation"]),
  candidate("a-room-that-explains-its-owner-a03", "A Room That Explains Its Owner", [
    "A room can reveal habits without explaining an entire person. A worn path between desk and bookshelf suggests repeated movement. Labels on storage boxes show one method of organizing. A half-built model may reveal a current project, patience, frustration, or simply a busy week.",
    "Interpretation becomes risky when evidence turns into certainty. A tidy desk does not prove a tidy mind. A crowded wall does not prove confusion. The room contains choices, accidents, gifts, limits of space, and objects placed by other people.",
    "Asking the owner changes the investigation. The unusual lamp may be practical, sentimental, or temporary. The owner can identify which objects feel representative and which are merely present. Their explanation is another source, not a command to ignore visible evidence.",
    "Personal pages resemble rooms because layout and objects communicate through selection. A theme can signal playfulness or focus. Friend groups and project posts show relationships. Yet a template that copies one person's room into everyone else's space destroys the evidence it claims to organize.",
    "Good interpretation stays proportional. The room may support a statement such as “this person builds models here.” It cannot support “this is everything the person values.” Representation becomes more accurate when observation and owner explanation remain visible together.",
  ], "Why is asking the room's owner useful?", "The owner can explain which objects are representative, practical, gifted, or temporary.", ["The owner's explanation makes all visible evidence irrelevant.", "A room always contains every object a person values."], ["evidence-strength", "perspective", "representation"]),
  candidate("the-costume-and-the-person-a04", "The Costume and the Person", [
    "A costume can reveal and conceal at the same time. An actor wearing a crown becomes legible as a ruler within a play, although the actor has no royal authority outside it. A team uniform shows membership while hiding individual clothing choices.",
    "Online presentation works similarly. A formal portrait, playful handle, or carefully written biography can express a real part of someone. It can also respond to a particular audience. The same person may present differently in a school forum, family group, and art community without one version being fake.",
    "Problems arise when the audience forgets the role of context. Confidence in a project update may be mistaken for confidence about everything. A humorous profile may be treated as evidence that the person never takes serious matters seriously.",
    "The owner needs control over these presentations. A system may offer a polished template, but applying one executive voice to every profile turns style into impersonation. The borrowed costume no longer communicates the owner's chosen role.",
    "Authenticity does not require displaying every private thought. It requires honesty about authorship and purpose. A selected presentation can be genuine when the person chose it, can revise it, and can decide its audience. The costume becomes misleading when another actor locks it onto the person and calls the result complete.",
  ], "When can different presentations of one person all be genuine?", "When the person chooses them honestly for different contexts and audiences.", ["Only when every profile uses identical wording and design.", "When an algorithm selects the presentation without owner control."], ["context", "authorship", "identity"]),
  candidate("what-a-profile-leaves-out-a05", "What a Profile Leaves Out", [
    "A profile might list five favorite books and omit the book currently being struggled through. It might show finished drawings but not abandoned sketches. Omission is unavoidable because a page has limited space and attention.",
    "The problem is not that profiles select. The problem is forgetting that they select. Viewers may treat visible interests as the boundaries of a person and invisible experiences as nonexistent. Ranking systems reinforce this mistake when they repeat the most reactive posts until those posts dominate the page.",
    "Owners can make selection more honest by controlling categories, dates, and archives. A current mood should not silently replace a longer biography. An old project can remain accessible without occupying the first screen forever. Privacy controls allow some meaningful information to stay intentionally absent from public view.",
    "Readers also have responsibilities. They can describe what the profile shows without claiming it proves more. “The page features model cities” is supported. “The owner cares about nothing else” is not.",
    "A good profile is therefore an invitation, not a complete inventory. It offers selected evidence about interests, relationships, and expression. Respecting what it leaves out protects both accuracy and privacy. The blank spaces may contain ordinary omissions, unfinished change, or choices that belong to the owner alone.",
  ], "What is the main interpretive risk created by profile omission?", "Viewers may mistake visible selections for the person's complete identity.", ["A profile with omissions cannot contain any true information.", "Privacy controls require owners to publish unfinished work."], ["inference", "privacy", "selection-effects"]),
  candidate("autoplay-is-not-personality-a06", "Autoplay Is Not Personality", [
    "A track begins automatically when a profile opens. The system records a play and concludes that the owner chose the music as a statement of identity. That conclusion skips an essential fact: no choice occurred at playback.",
    "Autoplay can serve a deliberate design when the owner enables it and visitors can stop it. Without those controls, the feature belongs to the template rather than the person. Repeated automatic plays measure page openings, not musical preference.",
    "The distinction matters because systems use behavior as evidence. If autoplay is counted as selection, the platform may recommend similar tracks, label the owner with a genre, and place music on other pages. One unchosen event becomes the source of increasingly confident predictions.",
    "Honest records identify how media began: owner selected, visitor selected, playlist continued, or autoplay triggered. The owner can then keep, change, or remove the feature without fighting a false history.",
    "Personality cannot be reduced to the sounds a page produced. Even a genuine manual choice represents one moment and purpose. A study track, joke, or shared performance may not define broader taste. Autoplay is especially weak evidence because it reports the system's action. Calling that action personality turns interface behavior into a claim about a person who never made it.",
  ], "What does an automatic play directly record?", "That the system started media when the page opened.", ["That the owner deliberately chose the track at that moment.", "That every visitor shares the owner's musical identity."], ["algorithmic-literacy", "consent", "evidence-strength"]),
  candidate("the-template-problem-a07", "The Template Problem", [
    "Templates reduce repeated work. A useful profile template can provide headings, accessible contrast, navigation, and empty modules ready for owner choices. The problem begins when the template contains one person's answers and treats them as defaults for everyone.",
    "Imagine a demonstration account built for an executive presentation. It uses a formal biography, public visibility, a promotional theme, and thousands of example contacts. Copying that structure may be efficient. Copying the identity fields overwrites the new owner's authorship.",
    "Systems need to distinguish form from content. “Biography field” is form; “available for keynotes” is content. “Choose privacy” is form; “public by vibe” is a particular decision. A global update can safely improve the field's keyboard label while leaving the owner's text and permission unchanged.",
    "Ownership metadata makes the boundary enforceable. Each value can name who chose it, when it changed, and whether a global process may edit it. A preview can show proposed changes without applying them.",
    "The best template disappears into support. It helps different pages remain usable without making them identical. When a system calls uniformity complete, it confuses consistency of tools with sameness of people. Good structure gives owners a place to speak; it does not supply the speech for them.",
  ], "What distinction prevents a template from overwriting identity?", "Separating reusable form and accessibility structure from owner-authored content and permissions.", ["Requiring every profile to use the demonstration account's answers.", "Removing ownership metadata from all fields."], ["systems-thinking", "authorship", "accessibility"]),
]);
