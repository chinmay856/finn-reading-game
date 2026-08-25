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

export function buildInternetRecoverySiteIdentityPatch({
  siteUrl,
  taskLabel,
  taskClass = "task-label",
  taskButtonWidth = 188,
}) {
  return `<g data-module="browser-chrome" data-purpose="persistent parody cue" data-shared-shell-patch="site-identity"><rect x="109" y="22" width="802" height="34" fill="url(#titleGradient)"/><text x="126" y="46" class="window-title">${siteUrl}</text><use href="#windowButton" x="817" y="26"/><use href="#windowButton" x="848" y="26"/><use href="#windowButton" x="879" y="26"/><path d="M825 43h11" stroke="#191919" stroke-width="3"/><rect x="855" y="32" width="13" height="13" fill="none" stroke="#222" stroke-width="2"/><path d="m886 33 13 13m0-13-13 13" stroke="#222" stroke-width="2"/><rect x="112" y="861" width="${taskButtonWidth}" height="31" fill="url(#buttonGradient)" stroke="#6d6d67" stroke-width="1.3"/><text x="54" y="882" class="${taskClass}" text-anchor="middle">START</text><text x="146" y="882" class="${taskClass}">${taskLabel}</text></g>`;
}
