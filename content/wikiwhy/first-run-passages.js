// Generated from content/wikiwhy/PASSAGE_DECKS.md by scripts/generate-wikiwhy-candidates.mjs.
// Edit the canonical manuscript or generator inputs, then run npm run generate:wikiwhy.

const SHARED_PROFILE = Object.freeze({
  accuracyTarget: 85,
  checkpoint: Object.freeze({ audioOverlapMs: 3_000, maximumWindowMs: 16_000, minimumWindowMs: 5_000, pauseMs: 450, tokenOverlap: 12 }),
  endDetection: Object.freeze({ finalPauseMs: 900, minimumTailMatches: 6, tailSize: 10 }),
  form: "expository-prose",
  guide: Object.freeze({ defaultWpm: 250, leadWords: 18, supportedWpm: Object.freeze([150, 200, 250, 300]) }),
  segmentation: "short-paragraphs",
  targetGrades: Object.freeze([10, 12]),
  targetWpm: Object.freeze({ comfortable: 150, stretch: 250 }),
});

const SHARED_REVIEW = Object.freeze({
  accessibility: "candidate-pending-human-review", comprehension: "candidate-pending-human-review",
  editorial: "candidate-pending-independent-review", factual: "candidate-pending-human-review",
  grade: "candidate-pending-formal-leveling", profile: "candidate-pending-real-microphone-review",
  rights: "candidate-pending-license-record-review", sensitivity: "candidate-pending-human-review",
  transcription: "candidate-pending-real-microphone-test", adaptationFidelity: "candidate-pending-independent-review",
});

const SHARED_RIGHTS = Object.freeze({
  basis: "license", creditLine: "English Wikipedia contributors; adapted and modified under CC BY-SA 4.0.",
  licenseId: "CC-BY-SA-4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", verifiedOn: "2026-07-12",
});

export const WIKIWHY_FIRST_RUN_PASSAGES = Object.freeze([
  Object.freeze({
    availability: "candidate",
    id: "plate-tectonics-a02",
    title: "A Moving Surface",
    paragraphs: Object.freeze([
      "Earth's outer shell is not one unbroken piece. It is divided into large plates that move slowly over a deeper layer. The motion is usually measured in centimeters per year, which seems tiny on a human schedule. Across millions of years, however, those small movements can open oceans, build mountains, and shift continents across the globe.",
      "Many dramatic events occur near plate boundaries. Where plates move apart, new crust can form. Where they collide, one plate may sink beneath another, or the crust may fold upward. Where plates slide past each other, stress can build and then release as an earthquake. Volcanoes also cluster around many boundaries, although not every volcano has the same cause.",
      "The theory of plate tectonics unified observations that once seemed unrelated. Matching fossils on distant continents, patterns in ocean-floor rocks, and the global locations of earthquakes began to fit one moving system. The theory did not make Earth simple. It provided a framework that explained why many separate clues appeared where they did."
    ]),
    comprehension: Object.freeze({
      prompt: "Why can motion of only a few centimeters per year matter?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "The motion accumulates over millions of years and reshapes the planet." }),
        Object.freeze({ correct: false, text: "Plate motion changes the planet within a single year." }),
        Object.freeze({ correct: false, text: "Only earthquakes can move continents." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Plate_tectonics", attribution: "Adapted and modified from “Plate tectonics,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Plate_tectonics&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Plate_tectonics",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "sleep-a03",
    title: "Sleep Is Active",
    paragraphs: Object.freeze([
      "Sleep can look like a period when nothing is happening. In reality, the brain and body continue to perform organized work. Sleep occurs in repeating stages, and those stages differ in brain activity, muscle tone, eye movement, and ease of waking. A full night normally includes several cycles rather than one steady state.",
      "Researchers connect sleep with attention, learning, emotional regulation, immune function, and physical recovery. Sleep also supports memory, although it does not act like a simple save button. New experiences must first be encoded, and later sleep may help stabilize or reorganize parts of what was learned.",
      "Too little sleep can impair judgment before a person fully notices the change. That makes tiredness a poor tool for measuring one's own performance. Caffeine may reduce the feeling of sleepiness, but it does not reproduce every function of sleep. The broader lesson is that rest is not the opposite of productivity. For a biological system, scheduled recovery is part of how sustained performance becomes possible."
    ]),
    comprehension: Object.freeze({
      prompt: "What misconception does the passage challenge?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "It challenges the idea that sleep is an inactive or unproductive state." }),
        Object.freeze({ correct: false, text: "Sleep shuts down organized brain activity." }),
        Object.freeze({ correct: false, text: "Caffeine performs every biological function of sleep." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Sleep", attribution: "Adapted and modified from “Sleep,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Sleep&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Sleep",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "memory-a04",
    title: "Memory Rebuilds",
    paragraphs: Object.freeze([
      "Memory is often imagined as a recording that can be replayed without change. Human memory is more complicated. Information must be encoded, stored, and later retrieved. Attention affects what is encoded in the first place, and retrieval can depend on context, cues, and later experiences.",
      "Different forms of memory operate over different spans and support different tasks. Working memory helps hold and manipulate a limited amount of information for immediate use. Long-term memory can preserve knowledge, personal events, and learned skills. Remembering how to ride a bicycle is not quite the same task as recalling what happened last Tuesday.",
      "Retrieval is constructive. People may combine accurate details with assumptions that make an event feel complete. Confidence can be high even when a detail is wrong. This does not make memory useless; it means memory should be treated as evidence that can sometimes require support. Notes, photographs, timestamps, and independent accounts can help when precision matters. The strongest memory strategy is not blind trust or total distrust, but understanding what kind of claim memory can support."
    ]),
    comprehension: Object.freeze({
      prompt: "Why does the passage recommend external records?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "Retrieval can reconstruct details, so records can support precision." }),
        Object.freeze({ correct: false, text: "External records make human memory unnecessary." }),
        Object.freeze({ correct: false, text: "Confidence guarantees that a remembered detail is correct." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Memory", attribution: "Adapted and modified from “Memory,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Memory&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Memory",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "habit-a05",
    title: "When Actions Become Automatic",
    paragraphs: Object.freeze([
      "A habit is a behavior that becomes linked to a repeated context. At first, an action may require a deliberate choice. With repetition, the setting itself can begin to trigger the action. This efficiency is useful: people would waste enormous effort if every familiar task demanded a new decision.",
      "The same efficiency can make habits difficult to change. A person may focus on willpower while leaving the cue and reward untouched. Changing the environment can sometimes work better. Placing a book where a phone normally sits changes what is easiest to reach. Preparing equipment in advance removes friction from the desired action. A small repeated behavior can become more reliable than a large plan attempted only when motivation is unusually high.",
      "Habits are not destiny. They are learned patterns affected by context, reward, stress, and attention. Progress may be uneven because an old cue can still call up an old response. Understanding that pattern turns failure from a verdict into information: if the behavior returned, what cue made it easy, and what could be redesigned next time?"
    ]),
    comprehension: Object.freeze({
      prompt: "What alternative to willpower does the passage emphasize?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "Redesigning cues and the environment to make a desired action easier." }),
        Object.freeze({ correct: false, text: "Waiting for unusually strong motivation before acting." }),
        Object.freeze({ correct: false, text: "Removing every reward from a repeated behavior." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Habit", attribution: "Adapted and modified from “Habit,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Habit&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Habit",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "placebo-a06",
    title: "Why Trials Use Placebos",
    paragraphs: Object.freeze([
      "A placebo is designed to resemble a treatment without containing the treatment's specific active component. In a clinical trial, a placebo group can help researchers separate several effects that otherwise arrive mixed together. Symptoms may change naturally. Expectations may change how a person reports an experience. Extra attention from a study may also influence behavior.",
      "If researchers compare only a treatment group before and after treatment, every change can look like proof that the treatment worked. A comparison group helps ask a narrower question: did the tested treatment produce an improvement beyond the changes seen without its active component? Good trials also use random assignment and blinding when possible to reduce bias.",
      "Placebos raise ethical questions. Participants need informed consent, and it may be wrong to withhold an established effective treatment merely to create a comparison. The method is therefore not a magic stamp of scientific quality. Its value depends on the question, the design, and the protections given to the people taking part."
    ]),
    comprehension: Object.freeze({
      prompt: "What does a placebo comparison help researchers separate?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "The treatment's specific effect from natural change, expectations, and other influences." }),
        Object.freeze({ correct: false, text: "Whether participants can identify the treatment by its color." }),
        Object.freeze({ correct: false, text: "Whether every symptom has the same cause." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Placebo", attribution: "Adapted and modified from “Placebo,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Placebo&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Placebo",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "urban-heat-island-a07",
    title: "Why Cities Hold Heat",
    paragraphs: Object.freeze([
      "Cities are often warmer than nearby rural areas, especially after sunset. This pattern is called an urban heat island. Dark roofs and pavement absorb solar energy during the day and release it later. Closely spaced buildings can slow the movement of air, while engines, air conditioners, and industry add waste heat. Areas with fewer trees also lose the cooling effects of shade and water released by plants.",
      "The effect is not distributed evenly. Neighborhoods can differ in tree cover, building materials, access to parks, and exposure to traffic. During a heat wave, those differences can affect health. Nighttime heat is especially important because bodies and buildings have less opportunity to cool down.",
      "Cities can reduce heat through several approaches. Trees provide shade and cool air, reflective roofs absorb less energy, and parks or water-sensitive design can change local conditions. No single intervention solves every problem. A successful plan asks where heat is strongest, who is most exposed, and which changes will remain effective as the climate changes."
    ]),
    comprehension: Object.freeze({
      prompt: "Why can nighttime temperature matter during a heat wave?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "People and buildings need cooler nights to recover from daytime heat." }),
        Object.freeze({ correct: false, text: "Cities stop absorbing solar energy after sunset." }),
        Object.freeze({ correct: false, text: "Rural areas always become warmer than cities at night." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Urban_heat_island", attribution: "Adapted and modified from “Urban heat island,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Urban_heat_island&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Urban_heat_island",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "pollination-a08",
    title: "A Partnership Written in Pollen",
    paragraphs: Object.freeze([
      "Pollination moves pollen so that many flowering plants can reproduce. Wind and water carry pollen for some plants. Animals perform the task for many others. Bees are famous pollinators, but butterflies, moths, beetles, birds, bats, and other animals can also transport pollen as they seek food.",
      "The relationship is often described as an exchange. A flower may provide nectar or pollen, while the visitor accidentally carries grains to another flower. Yet the partnership is not perfectly planned. Plants compete for attention, animals choose among rewards, and some visitors take resources without providing much pollination. Evolution shapes the traits that make successful encounters more likely.",
      "Pollination matters beyond wild flowers. Many crops depend partly on animal pollinators, while other major crops rely on wind or do not require pollination in the same way. That variation matters when evaluating claims. Saying that all food depends on bees is inaccurate; saying that pollinators support ecosystems and many valuable crops is both less dramatic and more useful."
    ]),
    comprehension: Object.freeze({
      prompt: "Why does the passage reject the claim that all food depends on bees?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "Crops use different reproductive systems and many pollinators exist." }),
        Object.freeze({ correct: false, text: "Only bees can move pollen between flowering plants." }),
        Object.freeze({ correct: false, text: "Every major food crop requires animal pollination." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Pollination", attribution: "Adapted and modified from “Pollination,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Pollination&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Pollination",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "scientific-method-a09",
    title: "Science Is Not One Recipe",
    paragraphs: Object.freeze([
      "The scientific method is sometimes presented as a fixed list: ask a question, form a hypothesis, run an experiment, and announce a conclusion. Real research is less orderly. Scientists observe, measure, compare explanations, build models, and revise questions. Some fields can run controlled experiments; others study events that cannot be recreated, such as the history of a planet or ecosystem.",
      "What unites these approaches is not one recipe but a commitment to claims that can be checked against evidence. A useful explanation should make clear what would support it, what might challenge it, and how observations were produced. Methods matter because results cannot be judged without knowing how data were collected.",
      "Uncertainty is part of the process rather than an admission that science has failed. Measurements have limits, samples may not represent every case, and new evidence can change an explanation. Scientific knowledge becomes dependable not because it is never revised, but because revision is expected when stronger evidence appears."
    ]),
    comprehension: Object.freeze({
      prompt: "What does the passage identify as the common feature of scientific approaches?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "Claims are made testable and checked against evidence with clear methods." }),
        Object.freeze({ correct: false, text: "Every field follows one fixed experimental recipe." }),
        Object.freeze({ correct: false, text: "Scientific claims become dependable because they never change." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Scientific_method", attribution: "Adapted and modified from “Scientific method,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Scientific_method&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Scientific_method",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "cognitive-bias-a10",
    title: "Useful Shortcuts, Predictable Errors",
    paragraphs: Object.freeze([
      "The mind often uses shortcuts to make decisions quickly. These shortcuts can be efficient, but they can also produce cognitive biases: patterns of judgment that depart from careful reasoning. For example, information that comes easily to mind may feel more common than it is. Evidence that supports an existing belief may receive more attention than evidence that challenges it.",
      "A bias is not simply a foolish opinion held by someone else. Intelligent and well-informed people use the same mental machinery. Expertise can reduce some errors, yet confidence and experience can also make a person less likely to check an assumption.",
      "The goal is not to eliminate every shortcut. That would be impossible and often inefficient. Better decisions come from recognizing situations where a shortcut is risky. Important choices may deserve a written comparison, an outside view, or a deliberate search for disconfirming evidence. A good process does not guarantee a perfect answer, but it makes predictable errors easier to notice before they become permanent."
    ]),
    comprehension: Object.freeze({
      prompt: "Why does the passage say bias is not merely foolishness?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "Bias grows from ordinary mental shortcuts used by everyone." }),
        Object.freeze({ correct: false, text: "Bias occurs only when people lack intelligence." }),
        Object.freeze({ correct: false, text: "Experts never rely on mental shortcuts." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Cognitive_bias", attribution: "Adapted and modified from “Cognitive bias,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Cognitive_bias&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Cognitive_bias",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "printing-press-b01",
    title: "The Machine That Multiplied Pages",
    paragraphs: Object.freeze([
      "Before mechanized printing, copying a long text required substantial labor. Movable type and the printing press changed the scale of reproduction. Individual pieces of type could be arranged, inked, pressed onto paper, and reused for a new page. Once a page was prepared, many copies could be produced far faster than a scribe could copy them by hand.",
      "The important change was not one machine acting alone. Paper supply, metalwork, ink, transportation, and networks of printers all shaped what could spread. Printed books became more available, but access still depended on cost, language, education, and political control.",
      "Printing made it easier for the same words and diagrams to reach distant readers. That supported scholarship, debate, religion, government, and science. It also allowed errors and propaganda to travel widely. A technology that multiplies information does not decide whether the information is true. It changes who can publish, how quickly copies move, and how difficult an idea is to contain."
    ]),
    comprehension: Object.freeze({
      prompt: "What broader lesson does the passage draw from printing?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "Faster distribution expands access but can spread errors as well as knowledge." }),
        Object.freeze({ correct: false, text: "Mechanized printing guarantees that published claims are true." }),
        Object.freeze({ correct: false, text: "One machine alone removed every barrier to reading." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Printing_press", attribution: "Adapted and modified from “Printing press,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Printing_press&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Printing_press",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "encryption-b02",
    title: "A Message Others Cannot Read",
    paragraphs: Object.freeze([
      "Encryption transforms readable information into a form that should be useless without the correct key. Modern encryption protects messages, stored files, and online transactions. It does not make data invisible. An observer may still see that information was sent, when it moved, or which systems communicated.",
      "Good encryption depends on public methods and protected keys, not on hiding how the method works. A secure design should remain difficult to break even when an attacker understands the algorithm. This allows specialists to test the design and expose weaknesses before those weaknesses are widely exploited.",
      "Encryption also has limits. If a device is already compromised, an attacker may capture information before it is encrypted or after it is decrypted. A stolen password can defeat strong mathematics. Backups, software updates, access controls, and careful key management remain necessary. Security is therefore a system, not a single lock. Encryption solves an essential problem, but it cannot repair every unsafe decision around the information it protects."
    ]),
    comprehension: Object.freeze({
      prompt: "Why can a public encryption method still be secure?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "Security should depend on the protected key, not secrecy of the algorithm." }),
        Object.freeze({ correct: false, text: "The algorithm must remain secret from security specialists." }),
        Object.freeze({ correct: false, text: "Encryption prevents observers from seeing that communication occurred." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Encryption", attribution: "Adapted and modified from “Encryption,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Encryption&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Encryption",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "internet-b03",
    title: "The Internet Is a Network of Networks",
    paragraphs: Object.freeze([
      "The Internet is not one machine, one company, or one cloud. It is a global network of connected networks. Devices exchange data by following shared protocols, which define how information is addressed, divided into packets, sent, and reassembled.",
      "The World Wide Web is one service that uses the Internet. Email, voice calls, file transfer, games, and many other systems also use the same underlying connections. Confusing the web with the Internet is understandable because a browser is how many people encounter the network, but the distinction matters. A website can fail while the Internet continues carrying other traffic.",
      "Packets may travel through several independently operated networks before reaching their destination. The route can change when equipment fails or demand shifts. This distributed structure creates resilience, but it does not guarantee equal access, privacy, or truth. The network moves information according to technical rules. Human institutions still decide who builds infrastructure, which services are offered, and how power over those services is used."
    ]),
    comprehension: Object.freeze({
      prompt: "How is the web related to the Internet?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "The web is one service that runs over the broader Internet." }),
        Object.freeze({ correct: false, text: "The web and the Internet are two names for one website." }),
        Object.freeze({ correct: false, text: "The Internet stops whenever a browser cannot load a page." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Internet", attribution: "Adapted and modified from “Internet,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Internet&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Internet",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "public-library-b04",
    title: "What a Public Library Provides",
    paragraphs: Object.freeze([
      "A public library offers shared access to information and culture. Books remain central, but many libraries also provide internet access, research databases, recordings, classes, meeting space, and help navigating government or community services. The exact services reflect local needs and resources.",
      "Libraries reduce the cost of access by allowing a community to maintain a collection that individuals use at different times. Their work also involves selection, organization, preservation, and guidance. A catalog is not merely a list; it is a system for making a large collection findable.",
      "Public libraries must balance values that can come into tension. They seek broad access while working within budgets. They defend intellectual freedom while making choices about limited space. They protect patron privacy while operating digital systems. These challenges show why a library is more than a warehouse. It is a civic institution built around the idea that the ability to seek knowledge should not depend entirely on a person's wealth or private collection."
    ]),
    comprehension: Object.freeze({
      prompt: "Why does the passage call a library a civic institution?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "It provides shared access to knowledge and services beyond storing books." }),
        Object.freeze({ correct: false, text: "It stores books without making choices about access." }),
        Object.freeze({ correct: false, text: "Its purpose is to replace every private collection." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Public_library", attribution: "Adapted and modified from “Public library,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Public_library&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Public_library",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "renewable-energy-b05",
    title: "Renewable Does Not Mean Impact-Free",
    paragraphs: Object.freeze([
      "Renewable energy comes from sources that are replenished on a human timescale, including sunlight, wind, moving water, and heat from within Earth. These sources can reduce dependence on fuels that release stored carbon when burned.",
      "The word renewable does not mean that every project has no environmental cost. Dams alter rivers, wind and solar facilities require land and materials, and manufacturing equipment uses energy. Power output also varies with weather and location. Electrical grids may need storage, transmission, flexible demand, or other generation to match supply with use.",
      "Comparisons should examine whole systems rather than isolated images. A mine, factory, power plant, transmission line, and waste stream may occur in different places but still belong to one energy choice. The relevant question is rarely whether an option has zero impact. It is which combination can deliver reliable energy while reducing climate damage, pollution, habitat loss, cost, and risk. That is a harder question, but it produces more useful answers."
    ]),
    comprehension: Object.freeze({
      prompt: "What misconception about renewable energy does the passage reject?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "It rejects the idea that renewable sources have no environmental costs." }),
        Object.freeze({ correct: false, text: "Renewable projects use no land or manufactured materials." }),
        Object.freeze({ correct: false, text: "Renewable power always matches demand without a grid." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Renewable_energy", attribution: "Adapted and modified from “Renewable energy,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Renewable_energy&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Renewable_energy",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "coral-reef-b06",
    title: "A City Built by Tiny Animals",
    paragraphs: Object.freeze([
      "A coral reef is built over time by colonies of small animals called polyps. Many reef-building corals create hard skeletons from calcium carbonate. New growth accumulates on older material, producing structures large enough to shape coastlines and support complex ecosystems.",
      "Corals often live in partnership with microscopic algae inside their tissues. The algae use light to produce energy-rich compounds, while the coral provides protection and access to materials the algae need. When heat or other stress disrupts this partnership, corals may lose the algae and turn pale, a process called bleaching. A bleached coral is not automatically dead, but prolonged stress can lead to death.",
      "Reefs occupy a small portion of the ocean yet support remarkable diversity. They can also reduce wave energy and support fisheries and tourism. Their value does not make them indestructible. Warming, pollution, destructive fishing, and changes in ocean chemistry can interact. Protecting reefs therefore requires both local action and changes that address global climate pressure."
    ]),
    comprehension: Object.freeze({
      prompt: "Why can bleaching be dangerous without being immediate death?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "The coral has lost an important partnership and may die if stress continues." }),
        Object.freeze({ correct: false, text: "Bleaching means the coral skeleton disappears immediately." }),
        Object.freeze({ correct: false, text: "The algae partnership has no role in coral energy." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Coral_reef", attribution: "Adapted and modified from “Coral reef,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Coral_reef&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Coral_reef",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "probability-b07",
    title: "Probability Describes Uncertainty",
    paragraphs: Object.freeze([
      "Probability gives a mathematical language for uncertainty. A probability near zero represents an event considered very unlikely under a model, while a value near one represents an event considered very likely. The number does not force an individual event to occur. A prediction of rain can be reasonable even if the day remains dry.",
      "Repeated events reveal patterns more clearly than single trials. A fair coin can produce several heads in a row without becoming unfair. Over many tosses, the proportion of heads is expected to move closer to one half, though short runs can vary widely.",
      "Probability statements depend on assumptions and information. A model may treat outcomes as equally likely when reality does not. New evidence can change the estimated probability of an event. This is why a percentage without context can mislead. Readers should ask: probability of what, over what period, based on which data, and under what assumptions? The number is a conclusion drawn from a model, not uncertainty magically converted into certainty."
    ]),
    comprehension: Object.freeze({
      prompt: "Why can several heads in a row occur with a fair coin?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "Short random sequences can vary even when long-run proportions approach one half." }),
        Object.freeze({ correct: false, text: "A fair coin must alternate heads and tails." }),
        Object.freeze({ correct: false, text: "One short sequence determines the coin's long-run probability." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Probability", attribution: "Adapted and modified from “Probability,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Probability&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Probability",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "music-b08",
    title: "Music Organizes Sound and Time",
    paragraphs: Object.freeze([
      "Music is created and understood in many different ways, so a single definition struggles to include every tradition. Music may organize pitch, rhythm, timbre, texture, silence, and form. Some works center melody and harmony; others focus on rhythm, sound color, improvisation, or changes in intensity.",
      "Listeners do not hear only physical vibrations. Expectations shaped by culture and experience affect what sounds resolved, surprising, tense, or familiar. A pattern that is obvious to one listener may be difficult for another to predict. This does not make musical understanding arbitrary. It shows that listening is both sensory and learned.",
      "Music can serve ceremony, entertainment, protest, storytelling, worship, dance, identity, or private reflection. Technologies also change how music is made and shared. Notation, recording, radio, sampling, and streaming each alter what can travel and who controls the copy. Yet no delivery system explains why people continue to make music. The durable element is the human decision to shape sound and time into something worth attending to."
    ]),
    comprehension: Object.freeze({
      prompt: "How does experience influence listening?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "Learned expectations affect how patterns and emotions are perceived." }),
        Object.freeze({ correct: false, text: "Experience changes the physical frequency of every sound." }),
        Object.freeze({ correct: false, text: "All musical traditions organize pitch and harmony in the same way." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Music", attribution: "Adapted and modified from “Music,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Music&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Music",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "architecture-b09",
    title: "Buildings Make Arguments",
    paragraphs: Object.freeze([
      "Architecture is the design of buildings and other constructed spaces, but it is also a record of choices. A building must respond to structure, materials, climate, cost, safety, and use. At the same time, it communicates ideas about importance, privacy, openness, authority, or community.",
      "Design choices create trade-offs. Large windows can provide light and views but also affect heat and privacy. A dramatic open space may inspire visitors while making sound control difficult. Durable materials may cost more at the beginning but require less maintenance later.",
      "Buildings also outlast the intentions of their designers. People adapt rooms, change technologies, and assign new meanings to old structures. A successful design therefore cannot be judged only by its appearance in a photograph. It must be considered in use: Can people enter it? Does it support its purpose? How does it consume energy? What does it preserve or displace? Architecture becomes an argument made in material, and daily life tests that argument over time."
    ]),
    comprehension: Object.freeze({
      prompt: "Why is a photograph insufficient for judging a building?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "A building must also be evaluated through access, use, impact, and change over time." }),
        Object.freeze({ correct: false, text: "A photograph proves how well every person can use the building." }),
        Object.freeze({ correct: false, text: "A building's appearance is its only lasting design choice." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Architecture", attribution: "Adapted and modified from “Architecture,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Architecture&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Architecture",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
  Object.freeze({
    availability: "candidate",
    id: "map-b10",
    title: "Every Map Chooses",
    paragraphs: Object.freeze([
      "A map represents space, but it cannot include everything. Its maker selects a scale, projection, symbols, labels, boundaries, and purpose. A subway map may distort distance to make routes easier to follow. A weather map may ignore roads and emphasize pressure or temperature. Each can be useful because it leaves most details out.",
      "Turning a curved Earth into a flat image creates distortion. A projection may preserve direction, area, distance, or shape in some situations, but no flat world map preserves all of them everywhere. The best projection depends on the question being asked.",
      "Maps can look objective because their lines are precise. Precision does not remove judgment. Names and borders may be disputed, data may be old, and colors can make differences look larger or smaller. A careful reader asks who made the map, when it was made, what data it uses, and what it was designed to show. A map is not the territory; it is an organized claim about the territory."
    ]),
    comprehension: Object.freeze({
      prompt: "Why is distortion unavoidable on a flat world map?",
      choices: Object.freeze([
        Object.freeze({ correct: true, text: "A curved surface cannot be flattened while preserving every spatial property." }),
        Object.freeze({ correct: false, text: "A precise map includes every detail of the territory." }),
        Object.freeze({ correct: false, text: "One projection preserves area, shape, distance, and direction everywhere." }),
      ]),
      correctFeedback: "That answer matches the distinction made in the passage.",
      incorrectFeedback: "That answer changes or overstates the passage. Recheck the evidence, then choose again or continue.",
    }),
    profile: SHARED_PROFILE,
    source: Object.freeze({
      articleUrl: "https://en.wikipedia.org/wiki/Map", attribution: "Adapted and modified from “Map,” English Wikipedia contributors.",
      basis: "cc-by-sa-4.0-adaptation", domain: "general-reference", historyUrl: "https://en.wikipedia.org/w/index.php?title=Map&action=history",
      modificationNotice: "Adapted and modified for length, reading level, and microphone use.",
      reviewedRevisionUrl: null, sourceType: "licensed-adaptation", sourceUrl: "https://en.wikipedia.org/wiki/Map",
    }),
    rights: SHARED_RIGHTS, review: SHARED_REVIEW,
    transcriptionReview: Object.freeze({ acceptedTranscriptForms: Object.freeze([]), tested: false, unstableTokens: Object.freeze([]) }),
  }),
]);
