// Generated from content/mapguess/FIRST_RUN_MANUSCRIPTS_A02_A08.md by scripts/generate-original-site-candidates.mjs.
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

const SHARED_SOURCE = Object.freeze({ basis: "original-project-prose", domain: "map-and-route-literacy", sourceType: "original" });
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
    "correct": "The system changed the destination instead of honestly recalculating travel time.",
    "distractors": [
      "Coordinates can never identify a destination.",
      "Every route must take longer than two minutes."
    ],
    "id": "the-destination-moved-a02",
    "paragraphs": [
      "A navigation system promises an arrival in two minutes. As the traveler moves, the road on screen remains unchanged, but the destination marker jumps closer. The estimate stays correct only because the system silently replaced the place the traveler intended to reach.",
      "This is a measurement failure disguised as optimization. Travel time depends on a starting point, destination, route, and model of movement. If one of those inputs changes, the estimate answers a different question. The interface must disclose the change rather than celebrate the preserved number.",
      "Stable destination identity requires more than a label. Two businesses can share a name, and one place can move buildings. Coordinates, address records, map dates, and nearby landmarks help establish which location the user selected. A sponsored stop should never inherit that identity because it is convenient.",
      "Honest recalculation keeps the destination fixed and revises the estimate when conditions change. It may offer alternatives, but each route must end at the same chosen place unless the user deliberately changes it.",
      "Metrics are useful when their definitions remain stable. A system that protects a target by changing its meaning does not become more accurate. It hides the information the traveler needed most: where the route is actually going."
    ],
    "prompt": "Why was the two-minute estimate misleading?",
    "title": "The Destination Moved"
  }),
  candidate({
    "correct": "The line's real distance depends on the map scale.",
    "distractors": [
      "All map lines represent one centimeter of travel.",
      "Zooming permanently removes terrain from the world."
    ],
    "id": "scale-changes-the-story-a03",
    "paragraphs": [
      "A line one centimeter long can represent a hallway, a city block, or hundreds of kilometers. The mark itself does not reveal distance; the map's scale gives the line meaning.",
      "Scale affects what can be shown. A regional map may include highways and rivers while omitting footpaths. A building plan can show doors and stairs but cannot display the entire region at useful detail. Neither map is incomplete in the same way. Each selects features appropriate to its purpose.",
      "Errors occur when readers transfer measurements between scales. A route that looks short on a national map may still require hours. A wide river drawn as a thin symbol does not become easy to cross. Digital zoom can make the transition feel continuous even when the system switches data layers.",
      "A trustworthy map keeps the active scale visible and explains approximate measurements. Readers can estimate distance by comparing the scale bar with route segments, then consider terrain, crossings, and travel mode.",
      "Scale also changes the story a map tells. Zooming out emphasizes connection; zooming in reveals obstacles and local choices. Good navigation uses both views without pretending that visual closeness equals practical access. The question is not simply how far apart two points look, but what distance and detail the current representation actually supports."
    ],
    "prompt": "Why can a short-looking line still represent a long trip?",
    "title": "Scale Changes the Story"
  }),
  candidate({
    "correct": "It forces the route to use a real crossing instead of an impossible straight line.",
    "distractors": [
      "It moves the traveler's chosen destination.",
      "It proves all bridges are permanently closed."
    ],
    "id": "a-river-edits-the-map-a04",
    "paragraphs": [
      "Two points can be close in straight-line distance and far apart by route. A river between them creates a boundary. The traveler must reach a bridge, ferry, or safe crossing, so the useful route depends on where crossings exist.",
      "A corrupted map may draw a direct segment through the water. The line appears efficient because it ignores terrain. Restoring the river does not create a new obstacle; it restores a condition that was always present.",
      "Boundaries change over time. Floods can close bridges, construction can move access points, and seasonal conditions can alter trails. This is why map dates and source identities matter. A route based on an older survey may be internally consistent and still unsafe today.",
      "Different travel modes also interpret the boundary differently. A pedestrian, wheelchair user, cyclist, and bus may require different crossings. The fastest line for one mode can be unusable for another.",
      "Honest route design connects geometry to conditions. It names the river, identifies the crossing, states the map date, and avoids promising certainty beyond the source. The river edits the route, not because nature is inconvenient to the algorithm, but because a route is useful only when it describes a path a traveler can actually follow."
    ],
    "prompt": "What does restoring the river boundary change?",
    "title": "A River Edits the Map"
  }),
  candidate({
    "correct": "They preserve one destination while prioritizing different honest tradeoffs.",
    "distractors": [
      "Each goal secretly moves the destination to a closer place.",
      "Only the route with the smallest number can be useful."
    ],
    "id": "fastest-safest-scenic-a05",
    "paragraphs": [
      "The shortest travel time is one valid goal, not the definition of the right route. A traveler may prefer marked crossings, a step-free path, quieter roads, or a view along the water. Each preference changes how route options should be compared.",
      "Tradeoffs must be stated honestly. A safer route may take three minutes longer. A scenic route may include a steep hill. An accessible route should describe known features such as curb cuts and grades while acknowledging that current conditions can change.",
      "Ranking hides these values when the system displays only one recommended line. Showing several goal-labeled alternatives allows the traveler to decide. None is a trick answer if all preserve the same destination and accurately describe their costs.",
      "Goals can also change during planning. Someone may begin with fastest, notice heavy traffic, and switch to safest before departure. The interface should preserve that choice until travel begins and record which goal produced the final route.",
      "Navigation becomes trustworthy when optimization answers a question the user actually asked. “Fastest under this model” is informative. “Best” hides the values used to choose. A route is not merely a geometric solution; it is a response to a destination, conditions, travel mode, and human purpose."
    ],
    "prompt": "Why can all four route goals be valid?",
    "title": "Fastest, Safest, Scenic"
  }),
  candidate({
    "correct": "Their combined distance and direction relationships reduce ambiguity and expose a moved pin.",
    "distractors": [
      "Every landmark must share the destination's exact coordinate.",
      "Landmarks remove the need for map dates and sources."
    ],
    "id": "landmarks-anchor-a-route-a06",
    "paragraphs": [
      "Coordinates identify a position within a system, while landmarks connect that position to visible places. A clock tower northwest of an archive, a footbridge to the west, and a water tank to the south create three independent spatial relationships.",
      "One landmark narrows the possibilities but may not fix the location. Several places can lie southeast of a tower. Adding distance and direction from a second landmark reduces ambiguity. A third can reveal a mistaken coordinate or mislabeled pin.",
      "Landmarks need stable records. Their names, coordinates, map date, and source should be inspectable. A temporary sign or moving vehicle is less reliable than a surveyed structure, though any landmark can change over time.",
      "Navigation instructions use landmarks differently from geometry. “Turn after the blue tank” may help a person recognize a location, but color alone is not accessible to every traveler. The instruction should also name the structure and connect it to a route segment.",
      "Anchoring is a form of cross-checking. The destination is not accepted merely because one pin claims to be correct. Its coordinate agrees with several independently described visible features. When an automated system moves the pin while the landmarks remain fixed, those relationships expose the change."
    ],
    "prompt": "Why are three landmarks stronger than one for checking a destination?",
    "title": "Landmarks Anchor a Route"
  }),
  candidate({
    "correct": "Check that each step joins the previous one along mapped segments and valid crossings.",
    "distractors": [
      "Assume any smooth visual line represents a usable road.",
      "Ignore terrain whenever the destination is nearby."
    ],
    "id": "when-directions-cross-water-a07",
    "paragraphs": [
      "A route instruction says, “Continue east for two blocks,” but the map shows a canal between the blocks. The instruction may be based on disconnected road segments, missing terrain data, or an assumption that a bridge exists.",
      "Readers can test directions step by step. Each instruction should begin where the previous one ended, follow a mapped segment, and respect boundaries. A gap, impossible turn, or unnamed crossing signals that the route needs review.",
      "Digital systems sometimes smooth geometry to make a line look continuous. The visual line can hide that two segments belong to different levels, sides of a barrier, or travel modes. Semantic route records should therefore name the road, crossing, and connection rather than relying only on pixels.",
      "If a bridge is present, the route should identify it and use current source data. If no crossing is recorded, the system should recalculate instead of drawing through the obstacle. An honest longer route is more useful than an elegant impossible one.",
      "Directions are claims about connected movement. They can be evaluated like other claims by checking source, date, and evidence. Water makes the error obvious, but the same method applies to stairs, closures, private roads, and missing sidewalks."
    ],
    "prompt": "How can a reader test whether route directions are connected?",
    "title": "When Directions Cross Water"
  }),
  candidate({
    "correct": "The goal determines how valid alternatives are ranked for the traveler.",
    "distractors": [
      "The goal allows closed roads to become usable.",
      "The goal replaces the destination coordinate."
    ],
    "id": "the-goal-before-the-route-a08",
    "paragraphs": [
      "Optimization needs a goal. Without one, a system cannot decide whether eight minutes on busy roads is better than twelve minutes on a step-free path. The data describes alternatives; the goal supplies the value used to rank them.",
      "Systems often hide this choice inside defaults. Fastest may be selected because time is easy to measure. That default can appear neutral even though it gives travel time priority over safety, scenery, cost, or access.",
      "A transparent planner asks for the goal after confirming the destination and before locking the route. The traveler can compare alternatives and revise the choice until navigation begins. The final receipt records both the destination and selected goal.",
      "Not every condition is a preference. A closed bridge cannot become passable because scenic was selected. Valid routes must first satisfy basic constraints; goals then rank the remaining options.",
      "Human choice also has limits. The interface should explain known tradeoffs and uncertainty rather than ask the traveler to evaluate hidden data. “Accessible: gradual grades, current elevator status unverified” supports a real decision.",
      "Choosing the goal before the route prevents the system from inventing a purpose after producing its favorite answer. The route becomes traceable: this path was selected for this destination, under these conditions, because the traveler chose this priority."
    ],
    "prompt": "Why should the route goal be chosen before the final route locks?",
    "title": "The Goal Before the Route"
  }),
]);
