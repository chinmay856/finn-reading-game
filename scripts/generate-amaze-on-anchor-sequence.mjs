#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { INTERNET_RECOVERY_COLORS as COLORS } from "./lib/internet-recovery-design-system.mjs";

const outputDirectory = path.resolve("docs/design/screens/2026-08-15/amaze-on-production");
const output = path.join(outputDirectory, "amaze-on-anchor-master-v1.svg");
const shellReferencePath = path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg");
const artDirectory = path.resolve("docs/design/screens/2026-08-15/non-wikiwhy-bookends");
fs.mkdirSync(outputDirectory, { recursive: true });

const shellReference = fs.readFileSync(shellReferencePath, "utf8");
const extractedReferenceDefs = shellReference.match(/<defs>([\s\S]*?)<\/defs>/)?.[1];
const referenceStyles = shellReference.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!extractedReferenceDefs || !referenceStyles) throw new Error("Could not extract the reviewed shared shell.");
const shellReferenceSha256 = crypto.createHash("sha256").update(extractedReferenceDefs).digest("hex");
const referenceDefs = extractedReferenceDefs.replaceAll('href="assets/', 'href="../wikiwhy-inkscape-spike/assets/');
const art = {
  goalazo: path.relative(outputDirectory, path.join(artDirectory, "amaze-on-goalazo-illustrated-v2.png")),
  cheapest: path.relative(outputDirectory, path.join(artDirectory, "amaze-on-cheapest-illustrated-v2.png")),
  classic: path.relative(outputDirectory, path.join(artDirectory, "amaze-on-classic-practical-v3.png")),
  light: path.relative(outputDirectory, path.join(artDirectory, "amaze-on-lightweight-practical-v3.png")),
};

const states = [
  { id: "initial", label: "Initial corruption", phase: "phase-1", mode: "phase1", step: 0, progress: 0, visualDelta: 0 },
  { id: "size", label: "Size restored", phase: "phase-1", mode: "phase1", step: 1, progress: 17, visualDelta: 1 },
  { id: "budget-brand", label: "Budget and brand restored", phase: "phase-1", mode: "phase1", step: 2, progress: 33, visualDelta: 1 },
  { id: "reviews", label: "Review context restored", phase: "phase-1", mode: "phase1", step: 3, progress: 50, visualDelta: 1 },
  { id: "delivery", label: "Delivery options restored", phase: "phase-1", mode: "phase1", step: 4, progress: 67, visualDelta: 2 },
  { id: "details", label: "Product details restored", phase: "phase-1", mode: "phase1", step: 5, progress: 83, visualDelta: 2 },
  { id: "repaired", label: "Ranking and useful choices restored", phase: "phase-1", mode: "phase1", step: 6, progress: 100, visualDelta: 3 },
  { id: "super-corrupt", label: "Auto-buy over-fix", phase: "act-2", mode: "act2", lock: 0, progress: 0 },
  { id: "locks", label: "Repair checklist", phase: "act-2-locks", mode: "act2", lock: 0, checklist: 0, progress: 0 },
  { id: "sponsor-lock", label: "Paid placement locked", phase: "act-2-locks", mode: "act2", lock: 1, checklist: 1, progress: 20 },
  { id: "reviews-lock", label: "Review context locked", phase: "act-2-locks", mode: "act2", lock: 2, checklist: 2, progress: 40 },
  { id: "needs-lock", label: "Fit and durability locked", phase: "act-2-locks", mode: "act2", lock: 3, checklist: 3, progress: 60 },
  { id: "delivery-lock", label: "Delivery and waste locked", phase: "act-2-locks", mode: "act2", lock: 4, checklist: 4, progress: 80 },
  { id: "permission-lock", label: "Permission locked", phase: "act-2-locks", mode: "act2", lock: 5, checklist: 5, progress: 100 },
  { id: "secured", label: "Site secured", phase: "completion", mode: "act2", lock: 5, progress: 100 },
];

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;");

function titlebarPatch() {
  return `<g data-shared-shell-patch="site-identity">
    <rect x="112" y="24" width="520" height="29" fill="url(#titleGradient)"/>
    <text x="126" y="46" class="window-title">www.amaze-on.com</text>
    <rect x="112" y="861" width="188" height="31" fill="url(#buttonGradient)" stroke="#6d6d67" stroke-width="1.3"/>
    <text x="54" y="882" class="task-label" text-anchor="middle">START</text>
    <text x="146" y="882" class="task-label">AMAZE-ON</text>
  </g>`;
}

function boxMark() {
  return `<g transform="translate(125 72)"><path d="M2 7 14 1l12 6-12 7z" fill="#FFAA18" stroke="#5B3908"/><path d="m2 7 12 7v13L2 20z" fill="#D98000" stroke="#5B3908"/><path d="m26 7-12 7v13l12-7z" fill="#F5AA2A" stroke="#5B3908"/></g>`;
}

function modelFor(state) {
  if (state.mode === "phase1") {
    const step = state.step;
    return {
      phase1: true, autoMode: false, rankingFixed: step >= 6,
      sponsorFixed: step >= 6, sizeFixed: step >= 1,
      budgetBrandFixed: step >= 2, reviewsFixed: step >= 3,
      deliveryFixed: step >= 4, detailsFixed: step >= 5,
      permissionFixed: true, cartCount: 0,
    };
  }
  const lock = state.lock;
  return {
    phase1: false, autoMode: lock < 5, rankingFixed: lock >= 3,
    sponsorFixed: lock >= 1, reviewsFixed: lock >= 2,
    sizeFixed: lock >= 3, budgetBrandFixed: lock >= 3,
    detailsFixed: lock >= 3, deliveryFixed: lock >= 4,
    permissionFixed: lock >= 5, cartCount: lock >= 5 ? 0 : 4,
  };
}

function header(state, model) {
  const repaired = model.rankingFixed && model.permissionFixed;
  const status = repaired
    ? "COMPARE RESULTS — NOTHING SELECTED"
    : model.autoMode ? "AUTO-BUY COMPLETE — SHIPPING NOW — RESEARCH REMOVED"
      : "1–4 OF 9,000 RESULTS — PAID RESULTS FIRST";
  const statusColor = repaired ? COLORS.repair : COLORS.corruption;
  const search = model.autoMode ? "AUTO ALREADY CHOSE FOR FINN" : "SOCCER SHOES";
  const cart = `Cart (${model.cartCount})`;
  return `<g data-qa-box="109,56,911,151">
    <rect x="109" y="56" width="802" height="61" fill="#153A5B"/>
    ${boxMark()}<text x="164" y="94" class="amaze-brand">amaze-on</text>
    <rect x="281" y="68" width="410" height="38" rx="4" fill="#fff" stroke="${model.autoMode ? COLORS.corruption : "#D5D9D9"}" stroke-width="2"/>
    <text x="299" y="93" class="amaze-search" style="fill:${model.autoMode ? COLORS.corruption : "#1C2A34"}" data-content-state="${model.autoMode ? "corrupted" : "fixed"}">${search}</text>
    <rect x="651" y="68" width="40" height="38" fill="#FFAA18"/><circle cx="669" cy="85" r="8" fill="none" stroke="#172D40" stroke-width="2"/><path d="m675 91 8 8" stroke="#172D40" stroke-width="2"/>
    <text x="724" y="92" class="amaze-nav">Orders</text>${model.autoMode ? `<g fill="${COLORS.corruption}" data-content-state="corrupted"><rect x="785" y="67" width="120" height="40" rx="7" fill="${COLORS.corruption}" stroke="${COLORS.corruptionDark}" stroke-width="2"/><path d="M796 77h6l3 15h20l3-10h-23M808 99a2.5 2.5 0 1 0 0 .1M823 99a2.5 2.5 0 1 0 0 .1" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="863" y="88" class="amaze-auto-buy" text-anchor="middle">AUTO-CART (4)</text><text x="863" y="101" class="amaze-auto-buy-sub" text-anchor="middle">BUYING NOW</text></g>` : `<text x="829" y="92" class="amaze-nav">${cart}</text>`}
    <rect x="109" y="117" width="802" height="34" fill="#F4F2EA" stroke="#C9C8C2"/>
    <text x="126" y="140" class="amaze-status" style="fill:${statusColor}" data-content-state="${repaired ? "fixed" : "corrupted"}">${status}</text>
    ${sortControl(model)}
  </g>`;
}

function sortControl(model) {
  const fixed = model.rankingFixed;
  const value = fixed ? "BEST MATCH" : model.autoMode ? "AUTO KNOWS BEST" : "DISABLED";
  const color = fixed ? COLORS.repairDark : COLORS.corruption;
  const surface = fixed ? COLORS.repairSoft : "url(#amazeCorruptHatch)";
  return `<g data-sort-control="true"><rect x="712" y="121" width="185" height="28" rx="6" fill="${surface}" stroke="${fixed ? COLORS.repair : COLORS.corruption}"/><text x="724" y="140" class="amaze-sort-label">Sort by:</text><text x="774" y="140" class="amaze-sort-value" style="fill:${color}" data-content-state="${fixed ? "fixed" : "corrupted"}">${value}</text><path d="m882 132 5 5 5-5" fill="none" stroke="${color}" stroke-width="2"/></g>`;
}

function filterRow(y, label, value, fixed) {
  const fill = fixed ? COLORS.repairSoft : "url(#amazeCorruptHatch)";
  const stroke = fixed ? COLORS.repair : COLORS.corruption;
  return `<text x="126" y="${y}" class="amaze-filter-label">${label}</text><rect x="126" y="${y + 9}" width="124" height="28" fill="${fill}" stroke="${stroke}"/><text x="188" y="${y + 28}" class="amaze-tiny" text-anchor="middle" style="fill:${fixed ? COLORS.repairDark : COLORS.corruption}" data-content-state="${fixed ? "fixed" : "corrupted"}">${value}</text>`;
}

function filters(model) {
  const size = model.sizeFixed ? "FINN'S SIZE" : model.autoMode ? "AUTO GUESSED" : "NOT SHOWN";
  const brand = model.budgetBrandFixed ? "ANY BRAND" : model.autoMode ? "AUTO FAVORITE" : "SPONSOR ONLY";
  const budget = model.budgetBrandFixed ? "UNDER $90" : model.autoMode ? "AUTO APPROVED" : "NO LIMIT";
  const delivery = model.deliveryFixed ? "GROUP DELIVERY" : "AIR-RUSH NOW";
  const reviews = model.reviewsFixed ? "ALL RATINGS" : "★★★★★ ONLY";
  const sort = model.rankingFixed ? "MATCH FINN'S NEED" : model.autoMode ? "AUTO KNOWS BEST" : "WHO PAYS US";
  const deliveryColor = model.deliveryFixed ? COLORS.repairDark : COLORS.corruption;
  const reviewColor = model.reviewsFixed ? COLORS.repairDark : COLORS.corruption;
  const sortColor = model.rankingFixed ? COLORS.repairDark : COLORS.corruption;
  return `<g data-qa-box="119,164,260,680">
    <rect x="119" y="164" width="141" height="516" fill="#F8F7F2" stroke="#C7C8C5"/>
    <text x="126" y="190" class="amaze-filter-title">FILTERS</text>
    ${filterRow(219, "SIZE", size, model.sizeFixed)}${filterRow(290, "BRAND", brand, model.budgetBrandFixed)}${filterRow(361, "BUDGET", budget, model.budgetBrandFixed)}
    <text x="126" y="444" class="amaze-filter-label">DELIVERY</text><rect x="126" y="455" width="16" height="16" fill="${model.deliveryFixed ? COLORS.repair : COLORS.corruption}"/><path d="m130 463 3 3 6-8" fill="none" stroke="#fff" stroke-width="2"/><text x="149" y="468" class="amaze-tiny" style="fill:${deliveryColor}" data-content-state="${model.deliveryFixed ? "fixed" : "corrupted"}">${delivery}</text>
    <text x="149" y="487" class="amaze-micro" style="fill:${deliveryColor}">${model.deliveryFixed ? "fewer trips + boxes" : "more trips + boxes"}</text>
    <text x="126" y="522" class="amaze-filter-label">REVIEWS</text><text x="126" y="545" class="amaze-tiny" style="fill:${reviewColor}" data-content-state="${model.reviewsFixed ? "fixed" : "corrupted"}">${reviews}</text><text x="126" y="563" class="amaze-micro">${model.reviewsFixed ? "dates + reviewer history" : "other reviews collapsed"}</text>
    <text x="126" y="600" class="amaze-filter-label">SORT</text><text x="126" y="623" class="amaze-tiny" style="fill:${sortColor}" data-content-state="${model.rankingFixed ? "fixed" : "corrupted"}">${sort}</text>
    ${model.autoMode ? `<text x="126" y="654" class="amaze-micro" style="fill:${model.rankingFixed ? COLORS.repairDark : COLORS.corruption}" data-content-state="${model.rankingFixed ? "fixed" : "corrupted"}">${model.rankingFixed ? "SORT RESTORED" : "CHANGES LOCKED"}</text>` : ""}
  </g>`;
}

function productCard({ x, y, image, banner, name, price, rating, line1, line2, line3, sponsored = false, bannerFixed, ratingFixed, detailsFixed, deliveryFixed, complete }) {
  const border = complete ? sponsored ? "#D97706" : COLORS.repair : COLORS.corruption;
  const bannerFill = bannerFixed ? sponsored ? "#FFF0D6" : COLORS.repairSoft : COLORS.corruptionSoft;
  const bannerColor = bannerFixed ? sponsored ? "#9A4A00" : COLORS.repairDark : COLORS.corruption;
  const priceColor = complete ? "#172D40" : COLORS.corruption;
  const ratingColor = ratingFixed ? "#53616A" : COLORS.corruption;
  const detailColor = detailsFixed ? "#53616A" : COLORS.corruption;
  const deliveryColor = deliveryFixed ? "#53616A" : COLORS.corruption;
  return `<g data-product-card="true" data-qa-box="${x},${y},${x + 304},${y + 242}">
    <rect x="${x}" y="${y}" width="304" height="242" rx="7" fill="#fff" stroke="${border}" stroke-width="2"/>
    <rect x="${x + 1}" y="${y + 1}" width="302" height="31" rx="6" fill="${bannerFill}"/>
    <text x="${x + 10}" y="${y + 21}" class="amaze-card-meta" style="fill:${bannerColor}" data-content-state="${bannerFixed ? "fixed" : "corrupted"}">${banner}</text>
    <image href="${image}" x="${x + 10}" y="${y + 42}" width="130" height="154" preserveAspectRatio="xMidYMid slice"/>
    <text x="${x + 148}" y="${y + 67}" class="amaze-card-title">${esc(name)}</text><text x="${x + 148}" y="${y + 103}" class="amaze-price" style="fill:${priceColor}" data-content-state="${complete ? "fixed" : "corrupted"}">${price}</text>
    <text x="${x + 148}" y="${y + 133}" class="amaze-card-meta" style="fill:${ratingColor}" data-content-state="${ratingFixed ? "fixed" : "corrupted"}">${rating}</text>
    <text x="${x + 148}" y="${y + 169}" class="amaze-card-meta" style="fill:${detailColor}" data-content-state="${detailsFixed ? "fixed" : "corrupted"}">${line1}</text>
    <text x="${x + 148}" y="${y + 195}" class="amaze-card-meta" style="fill:${detailColor}" data-content-state="${detailsFixed ? "fixed" : "corrupted"}">${line2}</text>
    <text x="${x + 148}" y="${y + 221}" class="amaze-card-meta" style="fill:${deliveryColor}" data-content-state="${deliveryFixed ? "fixed" : "corrupted"}">${line3}</text>
  </g>`;
}

function products(model) {
  const positions = [[274, 178], [588, 178], [274, 438], [588, 438]];
  if (model.rankingFixed) {
    const products = [
      [art.classic, "#1 · BEST MATCH", "Field Classic", "$72", "4.6 ★ · mixed", "FINN'S SIZE", "durable materials", "group delivery", false],
      [art.light, "#2 · GREAT VALUE", "Swift Step", "$64", "4.4 ★ · varied", "FINN'S SIZE", "durable + light", "fewer boxes", false],
      [art.cheapest, "#3 · SPONSORED AD — PAID", "Cheapest on Earth", "$1.03", "1.2 ★ · negative", "size uncertain", "falls apart", "replacement waste", true],
      [art.goalazo, "#4 · SPONSORED AD — PAID", "Goalazo Mega-Boot", "$9,999", "2.6 ★ · mixed", "not Finn's size", "paid placement", "not ranked first", true],
    ];
    return products.map((p, index) => productCard({
      x: positions[index][0], y: positions[index][1], image: p[0], banner: p[1], name: p[2], price: p[3],
      rating: model.reviewsFixed ? p[4] : "★★★★★ ONLY", line1: model.detailsFixed ? p[5] : "FIT HIDDEN",
      line2: model.detailsFixed ? p[6] : "MATERIALS HIDDEN", line3: model.deliveryFixed ? p[7] : "AIR-RUSH ONLY",
      sponsored: p[8], bannerFixed: model.sponsorFixed, ratingFixed: model.reviewsFixed,
      detailsFixed: model.detailsFixed, deliveryFixed: model.deliveryFixed,
      complete: model.sponsorFixed && model.reviewsFixed && model.detailsFixed && model.deliveryFixed,
    })).join("");
  }
  const initialBanners = ["#1 · PAID PLACEMENT", "#2 · ALSO PAID PLACEMENT", "#3 · YOU GUESSED IT — PAID AGAIN", "#4 · CHEAPEST — ALSO PAID"];
  const autoBanners = ["#1 · PAID AUTO-PICK", "#2 · ALSO PAID AUTO-PICK", "#3 · PAID AUTO-PICK AGAIN", "#4 · CHEAPEST + PAID AUTO-PICK"];
  const fixedBanners = ["#1 · SPONSORED AD — PAID", "#2 · SPONSORED AD — PAID", "#3 · SPONSORED AD — PAID", "#4 · SPONSORED AD — PAID"];
  const products = [
    [art.goalazo, "Goalazo Mega-Boot", "$9,999", "2.6 ★ · mixed", "not Finn's size", "durability unclear", "group delivery available"],
    [art.goalazo, "Goalazo Mega-Boot", "$9,999", "2.6 ★ · mixed", "not Finn's size", "durability unclear", "group delivery available"],
    [art.goalazo, "Goalazo Mega-Boot", "$9,999", "2.6 ★ · mixed", "not Finn's size", "durability unclear", "group delivery available"],
    [art.cheapest, "Cheapest on Earth", "$1.03", "1.2 ★ · negative", "size uncertain", "falls apart", "replacement waste shown"],
  ];
  return products.map((p, index) => productCard({
    x: positions[index][0], y: positions[index][1], image: p[0],
    banner: model.sponsorFixed ? fixedBanners[index] : model.autoMode ? autoBanners[index] : initialBanners[index],
    name: p[1], price: p[2], rating: model.reviewsFixed ? p[3] : model.autoMode ? "★★★★★ AUTO" : "★★★★★ ONLY",
    line1: model.detailsFixed ? p[4] : "FIT HIDDEN",
    line2: model.detailsFixed ? p[5] : "MATERIALS HIDDEN",
    line3: model.deliveryFixed ? p[6] : model.autoMode ? "QTY 1 · SHIPPING" : "AIR-RUSH ONLY",
    sponsored: true, bannerFixed: model.sponsorFixed, ratingFixed: model.reviewsFixed,
    detailsFixed: model.detailsFixed, deliveryFixed: model.deliveryFixed, complete: false,
  })).join("");
}

function autoCart(state) {
  if (state.id !== "super-corrupt") return "";
  return `<g data-overlay="auto-cart" data-qa-box="474,286,862,590" filter="url(#windowShadow)">
    <rect x="480" y="292" width="376" height="292" rx="7" fill="#FFF" stroke="${COLORS.corruptionDark}" stroke-width="3"/>
    <rect x="480" y="292" width="376" height="44" rx="7" fill="${COLORS.corruption}"/>
    <text x="499" y="321" class="amaze-cart-title">AUTO-CART — BUY NOW COMPLETE</text>
    <text x="500" y="365" class="amaze-cart-row">3 × GOALAZO MEGA-BOOT</text><text x="833" y="365" class="amaze-cart-row" text-anchor="end">$29,997</text>
    <text x="500" y="399" class="amaze-cart-row">1 × CHEAPEST ON EARTH</text><text x="833" y="399" class="amaze-cart-row" text-anchor="end">$1.03</text>
    <line x1="500" y1="420" x2="833" y2="420" stroke="#9A9A94"/>
    <text x="500" y="452" class="amaze-cart-total">TOTAL</text><text x="833" y="452" class="amaze-cart-total" text-anchor="end">$29,998.03</text>
    <rect x="500" y="475" width="333" height="42" rx="5" fill="${COLORS.corruption}"/><text x="666" y="502" class="amaze-cart-action" text-anchor="middle">ADDED TO CART · SHIPPING NOW</text>
    <text x="500" y="536" class="amaze-cart-note">AUTO STATUS: SPONSORS SAID THEIR SHOES WERE BEST.</text>
    <text x="500" y="554" class="amaze-cart-note">THEIR CLAIMS WERE LOUD AND VERY CONFIDENT.</text>
    <text x="500" y="572" class="amaze-cart-note">FINN'S CONFIRMATION: SKIPPED FOR EFFICIENCY.</text>
  </g>`;
}

function repairChecklist(checked) {
  const items = ["SHOW PAID PLACEMENT", "SHOW REAL REVIEWS", "SHOW ALL CHOICES", "SHOW DELIVERY + WASTE", "ASK BEFORE BUYING"];
  return `<g data-overlay="repair-checklist" data-qa-box="474,285,870,625" filter="url(#windowShadow)">
    <rect x="480" y="292" width="384" height="326" rx="7" fill="#FFF" stroke="${COLORS.repairDark}" stroke-width="3"/>
    <rect x="480" y="292" width="384" height="46" rx="7" fill="${COLORS.repair}"/>
    <text x="499" y="322" class="amaze-check-title">LOCK IN THE REPAIR</text>
    ${items.map((item, index) => {
      const fixed = index < checked;
      const y = 363 + index * 48;
      return `<g data-check-state="${fixed ? "fixed" : "open"}"><rect x="500" y="${y}" width="26" height="26" rx="4" fill="${fixed ? COLORS.repair : COLORS.corruptionSoft}" stroke="${fixed ? COLORS.repairDark : COLORS.corruption}"/><text x="513" y="${y + 19}" class="amaze-check-mark" text-anchor="middle" style="fill:${fixed ? "#fff" : COLORS.corruption}">${fixed ? "✓" : "○"}</text><text x="544" y="${y + 19}" class="amaze-check-row" style="fill:${fixed ? COLORS.repairDark : COLORS.corruption}" data-content-state="${fixed ? "fixed" : "corrupted"}">${item}</text></g>`;
    }).join("")}
  </g>`;
}

function footer(state, model) {
  const repaired = state.progress === 100 && model.rankingFixed && model.permissionFixed;
  const color = repaired ? COLORS.repair : COLORS.corruption;
  const status = repaired ? "FINN'S CHOICE RESTORED" : state.mode === "act2" ? "AUTO-BUY OVERRIDE ACTIVE" : "RANKING DISTORTED";
  return `<g data-site-footer="true"><rect x="109" y="690" width="802" height="148" fill="#F7F5EE"/><line x1="109" y1="690" x2="911" y2="690" stroke="#8E9AA0"/>
    <text x="126" y="727" class="amaze-meter" style="fill:${color}">SHOPPING CONTROL</text><text x="300" y="727" class="amaze-meter">${state.progress}%</text>
    <rect x="126" y="743" width="610" height="22" fill="#ECEBE6" stroke="${color}"/><rect x="126" y="743" width="${Math.round(610 * state.progress / 100)}" height="22" fill="${color}" data-role="site-progress-fill" data-percent="${state.progress}"/>
    <text x="892" y="759" class="amaze-footer-status" text-anchor="end" style="fill:${color}">${status}</text>
  </g>`;
}

function readingCompanion(state, model) {
  const finalLine = model.autoMode ? "Finn did not approve these orders." : model.rankingFixed ? "Nothing has been selected for Finn." : "Finn has not chosen a product yet.";
  return `<g data-companion-state="reading" data-qa-box="958,78,1395,552"><text x="964" y="106" class="reading-body">This passage restores one piece of</text><text x="964" y="144" class="reading-body">information Finn needs to compare.</text><rect x="960" y="171" width="404" height="34" fill="#F8DFA0"/><text x="964" y="197" class="reading-body">The storefront changes after Finn</text><text x="964" y="235" class="reading-body">finishes the quick check.</text><text x="964" y="288" class="reading-body">${finalLine}</text></g>`;
}

function site(state) {
  const model = modelFor(state);
  return `<g data-site-state="${state.id}"><rect x="109" y="56" width="802" height="782" fill="#FFF"/>${header(state, model)}${filters(model)}<text x="274" y="169" class="amaze-heading">RESULTS FOR SOCCER SHOES</text>${products(model)}${footer(state, model)}${autoCart(state)}</g>`;
}

function statePage(state, index) {
  const model = modelFor(state);
  const visualDelta = state.visualDelta === undefined ? "" : ` data-visual-delta="${state.visualDelta}"`;
  const checklist = state.checklist === undefined ? "" : repairChecklist(state.checklist);
  return `<g id="page-${state.id}" transform="translate(${index * 1480} 0)" inkscape:groupmode="layer" inkscape:label="${state.label}" data-phase="${state.phase}" data-site-progress="${state.progress}" data-site-progress-label="SHOPPING CONTROL" data-passage-progress="50"${visualDelta}><use href="#sharedShell"/>${titlebarPatch()}${site(state)}${readingCompanion(state, model)}<rect x="962" y="568" width="200" height="15" fill="#1387B2" data-role="passage-progress-fill" data-percent="50"/>${checklist}</g>`;
}

const pages = states.map((state, index) => `<inkscape:page x="${index * 1480}" y="0" width="1440" height="900" inkscape:label="${state.label}"/>`).join("");
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" width="1440" height="900" viewBox="0 0 1440 900" data-shell-reference-sha256="${shellReferenceSha256}"><sodipodi:namedview pagecolor="#BDBDBD">${pages}</sodipodi:namedview><defs>${referenceDefs}<pattern id="amazeCorruptHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="10" stroke="${COLORS.corruption}" stroke-opacity=".32" stroke-width="3"/></pattern></defs><style>${referenceStyles}
  .task-label,.amaze-brand,.amaze-nav,.amaze-auto-buy,.amaze-auto-buy-sub,.amaze-search,.amaze-status,.amaze-sort-label,.amaze-sort-value,.amaze-heading,.amaze-filter-title,.amaze-filter-label,.amaze-tiny,.amaze-micro,.amaze-card-title,.amaze-card-meta,.amaze-footer-status,.amaze-price,.amaze-meter,.amaze-cart-title,.amaze-cart-row,.amaze-cart-total,.amaze-cart-action,.amaze-cart-note,.amaze-check-title,.amaze-check-row,.amaze-check-mark{font-family:'Chalkboard SE','Comic Sans MS',sans-serif}.task-label{font-size:14px;font-weight:600;fill:#15191B}.amaze-brand{fill:#fff;font-size:22px;font-weight:700}.amaze-nav{fill:#fff;font-size:13px}.amaze-auto-buy{fill:#fff;font-size:10px;font-weight:700}.amaze-auto-buy-sub{fill:#fff;font-size:7px;font-weight:700}.amaze-search{font-size:13px}.amaze-status{font-size:12px}.amaze-sort-label{font-size:10px;fill:#172D40}.amaze-sort-value{font-size:9px;font-weight:700}.amaze-heading{font-size:20px;font-weight:700;fill:#172D40}.amaze-filter-title{font-size:17px;font-weight:700;fill:#172D40}.amaze-filter-label{font-size:12px;font-weight:700;fill:#172D40}.amaze-tiny{font-size:10.5px}.amaze-micro{font-size:9px;fill:#596267}.amaze-card-title{font-size:14.5px;font-weight:700;fill:#172D40}.amaze-card-meta{font-size:10.5px}.amaze-footer-status{font-size:9.5px}.amaze-price{font-size:25px;font-weight:700}.amaze-meter{font-size:13px;font-weight:700;fill:#172D40}.amaze-cart-title{font-size:15px;font-weight:700;fill:#fff}.amaze-cart-row{font-size:12px;fill:#172D40}.amaze-cart-total{font-size:16px;font-weight:700;fill:#172D40}.amaze-cart-action{font-size:13px;font-weight:700;fill:#fff}.amaze-cart-note{font-size:9.5px;fill:${COLORS.corruptionDark}}.amaze-check-title{font-size:16px;font-weight:700;fill:#fff}.amaze-check-row{font-size:12px;font-weight:700}.amaze-check-mark{font-size:15px;font-weight:700}
</style>${states.map(statePage).join("\n")}</svg>`;
fs.writeFileSync(output, svg);
console.log(`Wrote ${output} with ${states.length} Amaze-On sequence pages.`);
