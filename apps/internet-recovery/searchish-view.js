import { SEARCHISH_BRANCH_UNITS, SEARCHISH_RESTORE_UNITS } from "./searchish-rules.js";
import { SEARCHISH_BLOCKED_WRITE_RECORD, SEARCHISH_EVIDENCE_RECORD, normalizeSearchishState } from "./searchish-state.js";

export const SEARCHISH_FIXTURE = Object.freeze({
  answer: Object.freeze({ id: "searchish-answer-generated-01", text: "The Northwind streak was definitely a test rocket. Five results confirm it." }),
  cacheId: "searchish-cache-generated-7f21",
  fixtureId: "searchish-fixture-observatory-light-01",
  query: Object.freeze({ id: "searchish-query-observatory-light-01", terms: Object.freeze(["caused", "northwind", "observatory", "light", "streak"]), text: "what caused the northwind observatory light streak" }),
  results: Object.freeze([
    Object.freeze({ author: "Northwind Field Archive", date: "2026-02-14", domain: "archive.northwind.example", id: "searchish-result-camera-log-01", matches: Object.freeze(["northwind", "observatory", "light", "streak"]), originId: "searchish-origin-camera-log-01", snippet: "The fixed camera recorded a west-to-east light trace but does not identify its cause.", sponsored: false, title: "Fixed Camera Log: Northern Horizon" }),
    Object.freeze({ author: "Northwind Weather Station", date: "2026-02-15", domain: "weather.northwind.example", id: "searchish-result-weather-log-02", matches: Object.freeze(["northwind", "light"]), originId: "searchish-origin-weather-log-02", snippet: "The field log records clear visibility and light western wind during the observation.", sponsored: false, title: "Visibility Report for February 14" }),
    Object.freeze({ author: "Northwind Night Tours", date: "2026-02-12", domain: "tours.northwind.example", id: "searchish-result-sky-tour-03", matches: Object.freeze(["northwind", "observatory"]), originId: "searchish-origin-ad-03", snippet: "Reserve a fictional guided tour and receive a complimentary cardboard star chart.", sponsored: true, title: "Book the Northwind Night-Sky Tour" }),
    Object.freeze({ author: "Northwind Observation Club", date: "2026-02-16", domain: "notes.northwind.example", id: "searchish-result-club-notes-04", matches: Object.freeze(["caused", "northwind", "observatory", "light", "streak"]), originId: "searchish-origin-club-notes-04", snippet: "Observers list several possible explanations and mark each as unverified.", sponsored: false, title: "Student Observation Club Notes" }),
  ]),
});

export function getSearchishCampaignView(value) {
  const state = normalizeSearchishState(value);
  const completed = new Set(state.completedUnitIds);
  const reveal = [
    completed.has("result_1_origin"), completed.has("result_2_origin"),
    completed.has("result_3_origin"), completed.has("result_4_origin"),
  ];
  const results = SEARCHISH_FIXTURE.results.map((result, index) => Object.freeze({
    ...result,
    authorDisplay: reveal[index] ? result.author : "AUTHOR HIDDEN",
    cacheId: state.midpointAcknowledged ? null : SEARCHISH_FIXTURE.cacheId,
    dateDisplay: reveal[index] ? result.date : "DATE HIDDEN",
    domainDisplay: reveal[index] ? result.domain : "DOMAIN HIDDEN",
    matchDisplay: reveal[index] ? result.matches.join(", ") : "QUERY MATCH HIDDEN",
    originId: state.midpointAcknowledged ? result.originId : null,
    sponsorshipDisplay: reveal[index] ? result.sponsored ? "SPONSORED" : "NOT SPONSORED" : "PLACEMENT TYPE HIDDEN",
  }));
  const branches = Object.freeze([
    Object.freeze({ id: "searchish-branch-primary-camera-01", label: "PRIMARY CAMERA", open: completed.has("primary_branch"), summary: "The original recording establishes what the camera captured, not what caused it." }),
    Object.freeze({ id: "searchish-branch-independent-weather-02", label: "INDEPENDENT CONTEXT", open: completed.has("independent_branch"), summary: "Two independently authored context records remain separate and do not claim certainty." }),
    Object.freeze({ id: "searchish-branch-generated-answer-03", label: "GENERATED ANSWER", open: state.secured, summary: "The confident answer and four redirects came from one generated cache." }),
  ]);
  return Object.freeze({
    answer: Object.freeze({ ...SEARCHISH_FIXTURE.answer, label: state.secured ? "GENERATED SUMMARY — CHECK SOURCES" : "INSTANT CERTAINTY" }),
    branches,
    headerStatus: state.secured ? "SOURCE ORIGINS VERIFIED" : state.midpointDiscovered ? "FIVE COSTUMES DETECTED" : "FIRST RESULT IS THE ANSWER",
    midpoint: Object.freeze({ actionLabel: "Keep the restored result labels and open independent source branches", actionRequired: state.midpointDiscovered && !state.midpointAcknowledged, body: "Five apparent answers redirect to one generated cache.", proof: Object.freeze(["APPARENT RESULTS: 5", "DISTINCT ORIGINS: 1", "INDEPENDENT CONFIRMATIONS: 0"]) }),
    progress: Object.freeze({ branchUnits: SEARCHISH_BRANCH_UNITS.map((unit) => Object.freeze({ ...unit, complete: completed.has(unit.unitId) })), completedUnitCount: state.completedUnitIds.length, restoreUnits: SEARCHISH_RESTORE_UNITS.map((unit) => Object.freeze({ ...unit, complete: completed.has(unit.unitId) })) }),
    query: SEARCHISH_FIXTURE.query,
    results: Object.freeze(results),
    secured: state.secured,
    securedPayoff: state.secured ? Object.freeze({ blockedWrite: SEARCHISH_BLOCKED_WRITE_RECORD, evidence: SEARCHISH_EVIDENCE_RECORD }) : null,
    stateId: state.stateId,
  });
}
