import { PASSAGE_CATALOG, selectNextPassage } from "../../content/passage-catalog.js";
export const AMAZEON_DECK_A_IDS=Object.freeze(["the-five-star-mirage-a01","the-specification-card-a02","the-review-in-context-a03","the-sponsored-claim-a04","the-return-that-multiplied-a05","the-free-sample-problem-a06","the-seller-behind-the-listing-a07"]);
export const AMAZEON_DECK_B_IDS=Object.freeze(["the-price-and-the-value-b01","a-receipt-is-a-record-b02","the-choice-before-the-click-b03"]);
export const AMAZEON_CONTENT_READINESS=Object.freeze({deckACount:7,deckBCount:3,firstRunShortfall:0,plannedCount:10,requiredFirstRun:7,structuredCandidateCount:7});
export function selectNextAmazeOnPassage(state,options={}) { return Object.freeze({...selectNextPassage({...options,allowRepeat:false,catalog:options.catalog??PASSAGE_CATALOG,completedPassageIds:state?.completedPassageIds??[],preferredIds:AMAZEON_DECK_A_IDS}),...AMAZEON_CONTENT_READINESS}); }
