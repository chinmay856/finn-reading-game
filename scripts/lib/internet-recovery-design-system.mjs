export const INTERNET_RECOVERY_COLORS = Object.freeze({
  corruption: "#C5251E",
  corruptionDark: "#7A1815",
  corruptionSoft: "#F5D8D6",
  repair: "#2F8A49",
  repairDark: "#1F6034",
  repairSoft: "#DCEFDC",
  neutralInk: "#142330",
  neutralPaper: "#F8F7F0",
});

export const INTERNET_RECOVERY_LAYOUT = Object.freeze({
  canvas: Object.freeze({ width: 1440, height: 900 }),
  siteWindow: Object.freeze({ x: 105, y: 18, width: 810, height: 824 }),
  companionWindow: Object.freeze({ x: 935, y: 18, width: 480, height: 824 }),
  taskbar: Object.freeze({ x: 0, y: 854, width: 1440, height: 46 }),
  popup: Object.freeze({ x: 404, y: 225, width: 684, height: 354 }),
});

export const INTERNET_RECOVERY_LAYER_ORDER = Object.freeze([
  "shared-shell",
  "site-state",
  "site-progress",
  "act-two-repair-overlay",
  "dialogue-popup",
  "techno-overlay",
]);
