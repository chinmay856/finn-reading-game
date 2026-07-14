import { AMAZEON_RECEIPT_UNITS, AMAZEON_SORT_UNITS } from "./amazeon-rules.js";
import { AMAZEON_BLOCKED_WRITE_RECORD, AMAZEON_EVIDENCE_RECORD, normalizeAmazeOnState } from "./amazeon-state.js";

export const AMAZEON_FIXTURE = Object.freeze({
  fixtureId: "amazeon-fixture-lantern-kit-01",
  listing: Object.freeze({ description: "A fictional flat-pack paper lantern with a low-voltage reusable light puck. Assembly required.", id: "amazeon-listing-lantern-kit-01", itemId: "amazeon-item-foldlight-01", price: "$24.00", recommendation: "Recommended because you viewed fictional desk-building projects.", seller: "Cardboard Circuit Workshop", title: "Foldlight Desk Lantern Kit" }),
  parcels: Object.freeze([
    Object.freeze({ claim: "Light puck input: 5 volts. Shade material: flame-resistant craft paper. Kit mass: 310 grams.", destination: "Specification", id: "amazeon-parcel-spec-01", sourceType: "manufacturer specification", unitId: "specification_sorted" }),
    Object.freeze({ claim: "The folds were clearly marked, but aligning the final tab took patience.", destination: "Review", id: "amazeon-parcel-review-02", sourceType: "user review — Mira Quill — 2026-03-08", unitId: "review_sorted" }),
    Object.freeze({ claim: "The only desk light your imagination will ever need.", destination: "Advertisement", id: "amazeon-parcel-ad-03", sourceType: "SPONSORED CLAIM", unitId: "advertisement_sorted" }),
    Object.freeze({ claim: "This lantern increases homework quality by 300 percent.", destination: "Unknown", id: "amazeon-parcel-unknown-04", sourceType: "unknown / unverified", unitId: "unknown_sorted" }),
  ]),
  recommendations: Object.freeze([
    Object.freeze({ id: "amazeon-rec-techno-ball-01", label: "Orbit Bounce Ball", status: "SUGGESTED — NOT CHOSEN" }),
    Object.freeze({ id: "amazeon-rec-tape-tabs-02", label: "Reusable Tape Tabs", status: "RELATED SUPPLY" }),
    Object.freeze({ id: "amazeon-rec-paper-shade-03", label: "Replacement Paper Shade", status: "COMPATIBLE PART" }),
  ]),
});

export function getAmazeOnCampaignView(value) {
  const state = normalizeAmazeOnState(value);
  const done = new Set(state.completedUnitIds);
  const listingVisible = done.has("item_seller_receipt");
  const receiptVisible = done.has("price_return_receipt");
  return Object.freeze({
    headerStatus: state.secured ? "HUMAN CONFIRMATION REQUIRED" : state.midpointDiscovered ? "NEGATIVE PURCHASING DETECTED" : "RECOMMENDED MEANS CHOSEN",
    listing: Object.freeze({ ...AMAZEON_FIXTURE.listing, priceDisplay: receiptVisible ? AMAZEON_FIXTURE.listing.price : "PRICE HIDDEN", recommendationDisplay: listingVisible ? AMAZEON_FIXTURE.listing.recommendation : "RECOMMENDATION SOURCE HIDDEN", sellerDisplay: listingVisible ? AMAZEON_FIXTURE.listing.seller : "SELLER HIDDEN" }),
    midpoint: Object.freeze({ actionRequired: state.midpointDiscovered && !state.midpointAcknowledged, amyLine: "You sorted all four claims. That exposed the bigger problem: the store treated a return as permission to order two replacements.", body: "One return created two replacement deliveries without a new human choice.", chinmayLine: "The purchasing agent interpreted negative one item as a request for positive two items. It was very decisive.", label: "CLAIMS SORTED. PURCHASE CONTROL STILL BROKEN.", proof: Object.freeze(["RETURN REQUEST: 1", "REPLACEMENT ORDERS CREATED: 2", "NEW HUMAN CHOICE: 0", "PERMISSION USED: AUTO-DECIDE"]), visible: state.midpointDiscovered && !state.midpointAcknowledged }),
    parcels: Object.freeze(AMAZEON_FIXTURE.parcels.map((parcel) => Object.freeze({ ...parcel, sorted: done.has(parcel.unitId), visualStatus: done.has(parcel.unitId) ? "repaired" : "corrupted" }))),
    progress: Object.freeze({ completedUnitCount: state.completedUnitIds.length, receiptUnits: AMAZEON_RECEIPT_UNITS.map((unit) => Object.freeze({ ...unit, complete: done.has(unit.unitId) })), sortBoundary: AMAZEON_SORT_UNITS.length, sortUnits: AMAZEON_SORT_UNITS.map((unit) => Object.freeze({ ...unit, complete: done.has(unit.unitId) })) }),
    receipt: Object.freeze({ confirmation: state.secured ? "HUMAN CONFIRMATION REQUIRED" : "LOCKED", consent: state.secured ? "REMOVED" : state.midpointDiscovered ? "USED WITHOUT NEW HUMAN CHOICE" : "HIDDEN", originalOrderId: receiptVisible ? "amazeon-order-foldlight-01" : null, replacementCount: receiptVisible ? 2 : null, returnState: receiptVisible ? "RETURN REQUESTED" : "HIDDEN" }),
    recommendations: AMAZEON_FIXTURE.recommendations,
    secured: state.secured,
    securedPayoff: state.secured ? Object.freeze({ amyLine: "Finn separated facts, reviews, ads, and unknown claims, then restored the receipt and human confirmation. Nothing gets ordered without a person choosing it.", blockedWrite: AMAZEON_BLOCKED_WRITE_RECORD, chinmayLine: "The cart now waits for a click. Slower, yes. Considerably fewer surprise lanterns, also yes.", endOfSite: true, evidence: AMAZEON_EVIDENCE_RECORD, title: "AMAZE-ON FIXED" }) : null,
    stateId: state.stateId,
  });
}
