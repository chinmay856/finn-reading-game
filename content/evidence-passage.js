export const EVIDENCE_PASSAGE = Object.freeze({
  id: "evidence-001",
  paragraphs: Object.freeze([
    "Most people encounter scientific results after they have been compressed into a headline. The headline may sound certain, even when the original researchers were careful to describe limits and unanswered questions. Reading the full account means slowing down long enough to notice what was actually measured, who participated, and what comparison was made.",
    "Imagine a study reporting that students who sleep longer tend to earn higher grades. That pattern is a correlation: two things changed together. It does not prove that extra sleep caused the grades. Students with stable schedules might also have quieter homes, shorter commutes, or more time for homework. Each possibility offers another explanation for the same result.",
    "Researchers can make a claim stronger by planning comparisons in advance and measuring other factors that might influence the outcome. Even then, a single study rarely settles a complicated question. A small sample may not represent everyone, and a result found in one school may change somewhere else. Replication helps reveal which patterns are dependable.",
    "Good scientific reading is therefore less about accepting or rejecting a bold conclusion than asking useful questions. What evidence supports the claim? What remains uncertain? Would a different explanation fit the observations? Those questions do not weaken science. They are part of the process that turns an interesting result into knowledge people can trust.",
  ]),
  profile: Object.freeze({
    accuracyTarget: 85,
    checkpoint: Object.freeze({
      audioOverlapMs: 3_000,
      maximumWindowMs: 16_000,
      minimumWindowMs: 5_000,
      pauseMs: 450,
      tokenOverlap: 12,
    }),
    endDetection: Object.freeze({
      finalPauseMs: 900,
      minimumTailMatches: 6,
      tailSize: 10,
    }),
    form: "expository-prose",
    segmentation: "short-paragraphs",
    targetGrades: Object.freeze([10, 12]),
    targetWpm: Object.freeze({ comfortable: 130, stretch: 170 }),
  }),
  source: Object.freeze({ basis: "original", domain: "science", sourceType: "explanatory" }),
  title: "Why evidence matters",
});
