export const AMAZEON_SORT_UNITS = Object.freeze([
  Object.freeze({ unitId: "specification_sorted", stateId: "amazeon_specification_sorted", label: "SPECIFICATION" }),
  Object.freeze({ unitId: "review_sorted", stateId: "amazeon_review_sorted", label: "REVIEW" }),
  Object.freeze({ unitId: "advertisement_sorted", stateId: "amazeon_advertisement_sorted", label: "ADVERTISEMENT" }),
  Object.freeze({ unitId: "unknown_sorted", stateId: "amazeon_negative_purchasing", label: "UNKNOWN" }),
]);
export const AMAZEON_RECEIPT_UNITS = Object.freeze([
  Object.freeze({ unitId: "item_seller_receipt", stateId: "amazeon_item_seller_receipt", label: "ITEM + SELLER + RECOMMENDATION" }),
  Object.freeze({ unitId: "price_return_receipt", stateId: "amazeon_price_return_receipt", label: "PRICE + RETURN + REPLACEMENTS" }),
  Object.freeze({ unitId: "human_choice_gate", stateId: "amazeon_secured", label: "HUMAN CONFIRMATION" }),
]);
export const AMAZEON_CAMPAIGN_UNITS = Object.freeze([...AMAZEON_SORT_UNITS, ...AMAZEON_RECEIPT_UNITS]);
export function normalizeAmazeOnCompletedUnitIds(value) { const out=[]; if (!Array.isArray(value)) return Object.freeze(out); for (const unit of AMAZEON_CAMPAIGN_UNITS) { if (value[out.length] !== unit.unitId) break; out.push(unit.unitId); } return Object.freeze(out); }
export function getNextAmazeOnUnit(state={}) { const count=normalizeAmazeOnCompletedUnitIds(state.completedUnitIds).length; if (count>=7 || (count===4&&!state.midpointAcknowledged)) return null; return AMAZEON_CAMPAIGN_UNITS[count]; }
export function calculateAmazeOnReadingOutcome({accepted=true,campaignState={}}={}) { const unit=getNextAmazeOnUnit(campaignState); if(!accepted||!unit)return Object.freeze({accepted:false,kind:"no-advance",unitId:null}); return Object.freeze({accepted:true,kind:unit.unitId.endsWith("sorted")?"sort-unit":"receipt-unit",unitId:unit.unitId}); }
