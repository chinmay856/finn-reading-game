// Generated from content/searchish/FIRST_RUN_MANUSCRIPTS_A01_A07.md by scripts/generate-original-site-candidates.mjs.
// Edit the canonical manuscript or generator, then run npm run generate:site-content.

const SHARED_PROFILE = Object.freeze({
  accuracyTarget: 85,
  checkpoint: Object.freeze({ audioOverlapMs: 3_000, maximumWindowMs: 16_000, minimumWindowMs: 5_000, pauseMs: 450, tokenOverlap: 12 }),
  endDetection: Object.freeze({ finalPauseMs: 900, minimumTailMatches: 6, tailSize: 10 }),
  form: "expository-prose",
  guide: Object.freeze({ defaultWpm: 250, leadWords: 18, supportedWpm: Object.freeze([150, 200, 250, 300]) }),
  segmentation: "short-paragraphs", targetGrades: Object.freeze([10, 12]),
  targetWpm: Object.freeze({ comfortable: 150, stretch: 250 }),
});

const SHARED_SOURCE = Object.freeze({ basis: "original-project-prose", domain: "research-literacy", sourceType: "original" });
const SHARED_RIGHTS = Object.freeze({ basis: "original", creditLine: "Original prose created for Finn Reading Game.", verifiedOn: "2026-07-12" });
const SHARED_REVIEW = Object.freeze({
  accessibility: "candidate-pending-human-review", comprehension: "candidate-pending-human-review",
  editorial: "candidate-pending-independent-review", factual: "candidate-pending-human-review",
  grade: "candidate-pending-formal-leveling", profile: "candidate-pending-real-microphone-review",
  rights: "candidate-pending-original-work-record-review", sensitivity: "candidate-pending-human-review",
  transcription: "candidate-pending-real-microphone-test",
});

function candidate({ id, title, paragraphs, prompt, correct, distractors }) {
  return Object.freeze({
    availability: "candidate", contentRevision: `${id}@2026-07-12.1`, id, title, paragraphs: Object.freeze(paragraphs),
    comprehension: Object.freeze({
      prompt, choices: Object.freeze([
        Object.freeze({ correct: true, text: correct }),
        ...distractors.map((text) => Object.freeze({ correct: false, text })),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE, source: SHARED_SOURCE, rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  });
}

export const FIRST_RUN_PASSAGES = Object.freeze([
  candidate({
    "correct": "Both redirected to the same unsupported cache.",
    "distractors": [
      "They used different colors and headlines.",
      "Any two pages discussing one event must be duplicates."
    ],
    "id": "two-results-one-suspicious-message-a01",
    "paragraphs": [
      "The first result claimed that a strange light above the observatory was a test rocket. The second result appeared to confirm it. Both pages used different colors, headlines, and author names, so the agreement looked impressive. However, each page repeated the same unusual sentence: “The silent arc proves a controlled launch beyond reasonable doubt.”",
      "Repeated wording can be a clue. It may show that one page copied another, that both copied a press release, or that an automated system generated both from one summary. The clue does not prove which explanation is correct. It tells the reader to trace origins before counting the pages as independent sources.",
      "The source links revealed more. The first result cited a cache with no date or named publisher. The second linked to the same cache through a different web address. Neither page connected to the observatory's camera log, weather record, or observer notes. Two visible cards therefore represented one unsupported message rather than two investigations.",
      "Search results count pages, not independent evidence. A reader must ask who produced each claim, what source it uses, and whether another origin supports it. Agreement matters most when sources reached similar conclusions through genuinely separate evidence. When two paths end at the same anonymous cache, the second result adds reach, not confirmation."
    ],
    "prompt": "Why did the two results not provide independent confirmation?",
    "title": "Two Results, One Suspicious Message"
  }),
  candidate({
    "correct": "Its close relationship to the event, object, or decision studied.",
    "distractors": [
      "A guarantee that every statement in it is accurate.",
      "Its position as the first result on a search page."
    ],
    "id": "the-primary-source-a02",
    "paragraphs": [
      "A primary source is created close to the event, object, or decision being studied. A camera log recorded during an observation can be primary evidence about the camera's settings and timestamps. Meeting minutes can be primary evidence about what a board officially recorded. A letter can be primary evidence about what its writer said and believed at that moment.",
      "Primary does not mean perfect. A camera can face the wrong direction. Minutes can omit an argument. A letter writer can misunderstand events or deliberately mislead a reader. The label describes the source's relationship to the subject, not its guaranteed accuracy.",
      "The questions asked of the source must match what it can show. An observatory camera log may establish when a recording started, but it may not identify a light's cause. An official vote record may establish the final count, but it may not explain why each member voted that way. Other records provide context, comparison, and challenge.",
      "Search engines often place summaries above original records because summaries are easier to read. The reader should still look for the underlying source. Doing so reveals dates, methods, limitations, and exact wording that a snippet may compress. Primary sources deserve careful evaluation, not automatic trust. Their special value is that they shorten the chain between the reader and the evidence being examined."
    ],
    "prompt": "What does primary describe about a source?",
    "title": "The Primary Source"
  }),
  candidate({
    "correct": "They reached evidence through genuinely separate observation or research processes.",
    "distractors": [
      "They use different website layouts.",
      "They make the broadest possible claim about the event."
    ],
    "id": "the-independent-witness-a03",
    "paragraphs": [
      "Two witnesses can strengthen a conclusion when they observed an event independently. Independence means that one account did not simply copy, inherit, or depend on the other. It does not require the witnesses to disagree or to work in complete isolation from the world.",
      "Suppose a fixed camera records a light crossing the sky at 8:14. A separate weather station records clear conditions at the same time, and a student log notes the direction of the streak. The records answer different questions. Their timestamps and methods can be compared because each was produced through its own observation process.",
      "Now imagine five blogs repeating the student's sentence. The blogs may help the sentence travel, but they do not become five witnesses. Their apparent agreement depends on one observation. A citation trail should reveal that relationship so readers do not confuse repetition with corroboration.",
      "Independence also has degrees. Two reports may interview the same person but examine different documents. Two laboratories may use separate equipment but follow one flawed procedure. A careful researcher describes these connections instead of applying a simple independent label and stopping.",
      "The goal is to understand how each source knows what it claims. When separate methods point toward the same limited conclusion, confidence may increase. When many pages point backward to one account, the proper count remains one origin with many copies."
    ],
    "prompt": "What makes two sources independently useful?",
    "title": "The Independent Witness"
  }),
  candidate({
    "correct": "The result received paid placement and the sponsor benefits from attention.",
    "distractors": [
      "Every specification in the result is necessarily false.",
      "The result was ranked first by independent research."
    ],
    "id": "the-sponsored-answer-a04",
    "paragraphs": [
      "A search for “best study lamp” may produce an advertisement before ordinary results. The advertisement can include accurate specifications, a real price, and a working link. Its paid position still matters because the seller did not reach the top through independent evaluation. The seller purchased attention.",
      "Clear sponsorship labels help readers understand this relationship. The label does not command the reader to reject the product. It identifies who benefits from the placement and why the result appeared. That context changes how a claim such as “the most effective lamp for every student” should be examined.",
      "Search design can blur the boundary. Ads may resemble ordinary result cards, use familiar snippets, and appear beside generated answers. If the sponsorship label disappears, position can be mistaken for evidence. A highly placed claim may look widely trusted even when no independent comparison supports it.",
      "Evaluation continues after the label. Readers can compare specifications, inspect testing methods, look for independent reviews, and decide whether the product fits their needs. The relevant question is not merely whether the seller wants a purchase; almost every advertisement does. The question is whether the claim provides evidence appropriate to its certainty.",
      "Honest search keeps recommendation, advertisement, and evidence distinct. A sponsored result may be useful, but payment should never be disguised as proof that the result is correct."
    ],
    "prompt": "What does a sponsorship label explain?",
    "title": "The Sponsored Answer"
  }),
  candidate({
    "correct": "It can omit qualifications, dates, and surrounding context.",
    "distractors": [
      "Every snippet is written by the page's author as a final conclusion.",
      "Search previews always come from unrelated pages."
    ],
    "id": "what-a-snippet-leaves-out-a05",
    "paragraphs": [
      "A search snippet is a small preview, not a complete argument. It may contain a sentence from the page, words assembled around the query, or a summary produced by a search system. Its purpose is to help the reader decide whether opening the result may be useful.",
      "Compression creates risk. A snippet can omit the sentence that limits a claim. “The treatment improved performance” sounds decisive until the page adds “in a small preliminary test with no comparison group.” A date may be absent even though the information has become outdated. The displayed words may come from a navigation menu rather than the article's conclusion.",
      "Snippets also respond to queries. Two people searching for different phrases can see different previews of the same page. That variation helps locate relevant terms, but it means the preview is not a stable quotation chosen by the author.",
      "Before relying on a claim, readers should open the source and inspect its context. Who wrote the page? When was it updated? What evidence supports the statement? Does the full text express the same level of certainty as the preview?",
      "A useful snippet is a doorway. Problems arise when the doorway is treated as the entire building. Search can identify possible sources quickly, while evaluation begins after the result is opened."
    ],
    "prompt": "Why can a snippet misrepresent a page without using fabricated words?",
    "title": "What a Snippet Leaves Out"
  }),
  candidate({
    "correct": "As an origin clue to investigate alongside authorship, date, and evidence.",
    "distractors": [
      "As an automatic guarantee that the page is correct.",
      "As proof that unfamiliar publishers have no useful evidence."
    ],
    "id": "the-domain-clue-a06",
    "paragraphs": [
      "A domain name can provide a clue about a source, but it cannot complete the evaluation. A page ending in a familiar institutional suffix may belong to a government office, school, or organization. That relationship can help the reader identify responsibility. It does not guarantee that every page is current, relevant, or free from error.",
      "The full address matters. A misleading site may place a trusted name inside a long subdomain or path while belonging to a different owner. A personal page hosted by a university may express one person's view rather than an official position. An archived agency report may be authentic but superseded by newer guidance.",
      "Readers should connect the domain clue to other evidence. The About page can identify the publisher. Contact information, authorship, update dates, and linked methods show who accepts responsibility for the claim. External records can confirm whether the organization actually owns the domain.",
      "Unfamiliar domains are not automatically unreliable. A small research group or local archive may publish valuable original material. Familiar domains are not automatically sufficient. The question remains whether this page, by this author, using this evidence, supports the claim being considered.",
      "Search results become more honest when domains stay visible because readers can begin tracing origins before clicking. The domain is the first signpost in that investigation, not a stamp that replaces it."
    ],
    "prompt": "How should a reader use a domain name?",
    "title": "The Domain Clue"
  }),
  candidate({
    "correct": "Their dates, definitions, methods, evidence, and exact questions.",
    "distractors": [
      "Which result uses the most confident headline.",
      "Which result appears first in the ranking."
    ],
    "id": "when-results-disagree-a07",
    "paragraphs": [
      "Conflicting search results do not always mean that one side is lying. Sources may use different definitions, examine different periods, or answer related but distinct questions. One report might count every library visit, while another counts only registered borrowers. Their totals can differ even when both calculations are accurate.",
      "Dates often explain disagreement. An early report may describe incomplete information that a later investigation revises. Methods matter too. A survey of volunteers may produce a different estimate from a random sample. Before choosing the result that sounds most confident, readers should compare what each source actually measured.",
      "Some conflicts are genuine. Experts can evaluate the same evidence and reach different conclusions about its meaning. In that case, a responsible summary describes the disagreement, identifies areas of agreement, and explains what evidence could resolve the open question. It does not manufacture certainty by merging every result into one answer.",
      "Readers can build a comparison table: source, date, definition, method, evidence, and conclusion. This slows the search slightly but makes the disagreement understandable. It also reveals copied claims that only appear independent.",
      "The purpose of research is not to force every source into agreement. It is to determine why the results differ and which conclusion the available evidence supports. Uncertainty stated clearly is more informative than confidence produced by hiding the conflict."
    ],
    "prompt": "What should a reader compare first when credible results disagree?",
    "title": "When Results Disagree"
  }),
]);
