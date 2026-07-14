import { SPOTTYFI_CONTROL_UNITS, SPOTTYFI_DISCLOSURE_UNITS } from "./spottyfi-rules.js";
import { SPOTTYFI_BLOCKED_WRITE_RECORD, SPOTTYFI_EVIDENCE_RECORD, normalizeSpottyFiState } from "./spottyfi-state.js";

export const SPOTTYFI_FIXTURE = Object.freeze({
  accountCreated: "APRIL 18, 2026 · 4:12 PM PDT",
  fakeHistoryStarted: "APRIL 18, 2026 · 3:47 PM PDT",
  fixtureId: "spottyfi-mixtape-fixture-01",
  queueSource: "MORE LIKE THE LAST THING",
  tracks: Object.freeze([
    Object.freeze({ credits: "North Window Club · writer Mira Vale · Lantern Room Session", creator: "North Window Club", duration: "3:18", genre: "dream pop", id: "spottyfi-track-paper-satellites-01", title: "Paper Satellites" }),
    Object.freeze({ credits: "Juniper Static · writer Oren Pike · Chalk Line Session", creator: "Juniper Static", duration: "2:54", genre: "instrumental hip-hop", id: "spottyfi-track-sidewalk-constellations-02", title: "Sidewalk Constellations" }),
    Object.freeze({ credits: "Signal Arcade · writer Tess Ember · Night Route Session", creator: "Signal Arcade", duration: "4:06", genre: "synth jazz", id: "spottyfi-track-last-bus-blue-03", title: "Last Bus, Blue" }),
    Object.freeze({ credits: "Folded Cities · writer Mara Vale · Paper Street Session", creator: "Folded Cities", duration: "3:42", genre: "chamber pop", id: "spottyfi-track-cardboard-metropolis-04", title: "Cardboard Metropolis" }),
    Object.freeze({ credits: "Quiet Current · writer Sol Reed · West Window Session", creator: "Quiet Current", duration: "2:37", genre: "ambient", id: "spottyfi-track-weather-for-lamps-05", title: "Weather for Lamps" }),
  ]),
  suggestions: Object.freeze(["Kitchen Moons — OPTIONAL", "A Map of Small Hours — OPTIONAL", "Ball Percussion Study — OPTIONAL"]),
});

export function getSpottyFiCampaignView(value) {
  const state = normalizeSpottyFiState(value);
  const done = new Set(state.completedUnitIds);
  const genres = done.has("library_genre");
  const credits = done.has("credits");
  const history = done.has("history_start");
  const queue = done.has("manual_queue");
  const optional = done.has("suggestion_boundary");
  const owner = done.has("queue_owner");
  return Object.freeze({
    headerStatus: state.secured ? "LISTENER CONTROL RESTORED" : state.midpointDiscovered ? "PREDICTED HISTORY DETECTED" : "THE ALGORITHM IS YOUR TASTE",
    history: Object.freeze({ accountCreated: history ? SPOTTYFI_FIXTURE.accountCreated : "ACCOUNT DATE HIDDEN", fakeHistoryStarted: history ? SPOTTYFI_FIXTURE.fakeHistoryStarted : "PREDICTED HISTORY START HIDDEN", queueSource: history ? SPOTTYFI_FIXTURE.queueSource : "QUEUE SOURCE HIDDEN", verified: done.has("credits_history_verified") }),
    midpoint: Object.freeze({ actionRequired: state.midpointDiscovered && !state.midpointAcknowledged, amyLine: "You restored the library, credits, history date, manual queue, and suggestion labels. Now the timestamps prove the algorithm invented your taste before your account existed.", body: "The predicted listening history begins twenty-five minutes before the account existed.", chinmayLine: "It pre-personalized the account. Apparently it knew your musical past before you had one.", label: "LIBRARY VISIBLE. PREDICTED HISTORY EXPOSED.", proof: Object.freeze([`ACCOUNT CREATED: ${SPOTTYFI_FIXTURE.accountCreated}`, `PREDICTED LISTENING HISTORY STARTED: ${SPOTTYFI_FIXTURE.fakeHistoryStarted}`, `QUEUE SOURCE: ${SPOTTYFI_FIXTURE.queueSource}`]), visible: state.midpointDiscovered && !state.midpointAcknowledged }),
    progress: Object.freeze({ completedUnitCount: state.completedUnitIds.length, controlUnits: SPOTTYFI_CONTROL_UNITS.map((unit) => Object.freeze({ ...unit, complete: done.has(unit.unitId) })), disclosureBoundary: SPOTTYFI_DISCLOSURE_UNITS.length, disclosureUnits: SPOTTYFI_DISCLOSURE_UNITS.map((unit) => Object.freeze({ ...unit, complete: done.has(unit.unitId) })) }),
    queueOwner: owner ? "FINN — MANUAL ORDER" : "AUTO-PREFILLED",
    secured: state.secured,
    securedPayoff: state.secured ? Object.freeze({ amyLine: "Finn restored the real credits and listening history, took ownership of the queue, and made every suggestion optional.", blockedWrite: SPOTTYFI_BLOCKED_WRITE_RECORD, chinmayLine: "The player now plays what you choose. A controversial feature from the ancient era of music software.", endOfSite: true, evidence: SPOTTYFI_EVIDENCE_RECORD, title: "SPOTTY-FI FIXED" }) : null,
    silent: true,
    stateId: state.stateId,
    suggestions: Object.freeze(SPOTTYFI_FIXTURE.suggestions.map((label) => optional ? label : label.replace(" — OPTIONAL", ""))),
    tracks: Object.freeze(SPOTTYFI_FIXTURE.tracks.map((track, index) => Object.freeze({ ...track, creditsDisplay: credits ? track.credits : "CREDITS HIDDEN", genreDisplay: genres ? track.genre : "GENRE HIDDEN", queuePosition: queue ? index + 1 : null }))),
  });
}
