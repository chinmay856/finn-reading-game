#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/chinmayamy/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const svgPath = path.resolve(process.argv[2] ?? "docs/design/screens/2026-08-16/searchish-production/searchish-anchor-master-v3.svg");
const outDir = path.dirname(svgPath);
const source = fs.readFileSync(svgPath,"utf8");
const shell = fs.readFileSync(path.resolve("docs/design/screens/2026-08-15/wikiwhy-inkscape-spike/wikiwhy-phase-one-master-v2.svg"),"utf8");
const errors = [];

const expectedHash = crypto.createHash("sha256").update(shell.match(/<defs>([\s\S]*?)<\/defs>/)?.[1]).digest("hex");
if (source.match(/data-shell-reference-sha256="([a-f0-9]+)"/)?.[1] !== expectedHash) errors.push("Search-ish does not use the reviewed shell hash.");
for (let index=1;index<=14;index+=1) if (!fs.existsSync(path.join(outDir,`searchish-anchor-v3_p${index}.png`))) errors.push(`Missing exported Search-ish frame ${index}.`);
if (!fs.existsSync(path.join(outDir,"searchish-anchor-review-v3.html"))) errors.push("Missing Search-ish review page.");

const browser = await chromium.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
const page = await browser.newPage({viewport:{width:1440,height:900}});
await page.goto(pathToFileURL(svgPath).href);
await page.waitForTimeout(250);
errors.push(...await page.evaluate(()=>{
  const issues=[];
  const states=[...document.querySelectorAll("g[id^='page-']")];
  const byId=(id)=>document.querySelector(`#page-${id}`);
  const need=(state,values)=>values.forEach((value)=>{if(!state?.textContent.includes(value))issues.push(`${state?.id??"missing"} missing ${value}`);});
  if(states.length!==14)issues.push(`Expected fourteen Search-ish states; found ${states.length}.`);
  for(const state of states){
    for(const module of ["browser-chrome","search-header","site-meter","reading-copy"]){if(state.querySelectorAll(`[data-module='${module}']`).length!==1)issues.push(`${state.id} needs exactly one ${module}.`)}
    if(/\b(?:ACT|PHASE)\s*[12]\b/i.test(state.textContent))issues.push(`${state.id} exposes Act/Phase language.`);
    const playerFacingText=state.textContent.replace(/Huckleberry\s+Finn/gi,"");
    if(/\bFINN(?:'S)?\b/i.test(playerFacingText))issues.push(`${state.id} exposes the player name outside the book title.`);
    if(/DESIGN NOTE|REPAIR TARGET|STORY REVIEW|PASSAGE COPY/i.test(state.textContent))issues.push(`${state.id} leaks production language.`);
    for(const text of state.querySelectorAll("[data-module='search-header'] text,[data-results-layout] text,[data-module='auto-answer'] text,[data-module='site-meter'] text,[data-module='lock-overlay'] text")){
      const box=text.getBBox();
      if(box.x<118||box.x+box.width>901||box.y<56||box.y+box.height>838)issues.push(`${state.id} site text outside its window: ${text.textContent.trim().slice(0,50)}`);
    }
    for(const text of state.querySelectorAll("[data-module='reading-copy'] .reading-body"))if(text.getBBox().width>420)issues.push(`${state.id} Reading Companion line overflows: ${text.textContent}`);
    for(const text of state.querySelectorAll(".si-query"))if(text.getBBox().width>500)issues.push(`${state.id} search query overflows.`);
    for(const text of state.querySelectorAll(".si-link,.si-result-title,.si-auto-title,.si-auto-sub"))if(text.getBBox().width>690)issues.push(`${state.id} lesson-bearing text overflows: ${text.textContent}`);
    for(const text of state.querySelectorAll(".si-lock-label"))if(text.getBBox().width>210)issues.push(`${state.id} lock label overflows: ${text.textContent}`);
    if(!state.textContent.includes("About 1,240 results"))issues.push(`${state.id} loses the persistent result count.`);
    if(state.querySelector(".si-chip"))issues.push(`${state.id} retains the unused filter-chip row.`);
  }

  const ids=["initial","overview-corrected","overview-optional","paid-labeled","library-restored","bookstore-restored","hierarchy-restored","auto-overfix","lock-open","ai-lock","optional-lock","options-lock","search-lock","secured"];
  if(ids.some((id)=>!byId(id)))issues.push("One or more required Search-ish states are missing.");
  const first=ids.slice(0,7).map(byId), locks=ids.slice(7,13).map(byId), secured=byId("secured");
  const firstProgress=first.map((state)=>Number(state?.getAttribute("data-site-progress")));
  if(firstProgress.join(",")!=="0,17,33,50,67,83,100")issues.push(`First-run progress mismatch: ${firstProgress}`);
  const lockProgress=locks.map((state)=>Number(state?.getAttribute("data-site-progress")));
  if(lockProgress.join(",")!=="0,0,25,50,75,100")issues.push(`Lock-run progress mismatch: ${lockProgress}`);
  if(Number(secured?.getAttribute("data-site-progress"))!==100)issues.push("Secured frame must remain at 100%.");

  need(first[0],["print copy of Adventures of Huckleberry Finn","I CAN HELP WITH THE BOOK.","You asked for a print copy","follows a boy traveling on the Mississippi River","There is a raft, a journey","Internet Mega Bookstore","Public Library — print copy available","About 1,240 results"]);
  need(first[1],["ADVENTURES OF HUCKLEBERRY FINN","published in the 1880s","Print copies are available"]);
  need(first[2],["AI OVERVIEW","SHOW MORE"]);
  need(first[3],["SPONSORED PRODUCTS · PAID PLACEMENT"]);
  need(first[4],["CITY LIBRARY","www.citylibrary.org/catalog","Project Gutenberg","gutenberg.org/files","Internet Archive","archive.org/details"]);
  need(first[5],["NEIGHBORHOOD BOOKS","www.neighborhoodbooks.com","Local pickup"]);
  need(first[6],["Public Library — print copy available","Neighborhood Books — new and used copies","SPONSORED PRODUCTS · PAID PLACEMENT","FREE ONLINE EDITIONS","AI OVERVIEW","VIEW MORE RESULTS"]);
  need(locks[0],["AUTO ALREADY SEARCHED FOR YOU","AUTO SEARCH · BLUETOOTH ENABLED","HUCKLEBERRY FINN SHORTCUT FOUND.","HUCKLEBERRY FINN STUDY NOTES","Fast summary edition","OTHER RESULTS (47) · COLLAPSED","ONE BEST ANSWER · ZERO EXTRA SEARCHING"]);
  need(locks[1],["LOCK IN THE REPAIR","FIX THE AI","MAKE AI OPTIONAL","SHOW REAL OPTIONS","KEEP THE SEARCH"]);
  need(locks[2],["ADVENTURES OF HUCKLEBERRY FINN","OTHER RESULTS (47) · STILL COLLAPSED"]);
  need(locks[3],["AI OVERVIEW","OTHER RESULTS (47) · STILL COLLAPSED"]);
  need(locks[4],["Public Library — print copy available","Neighborhood Books — new and used copies","SPONSORED PRODUCTS · PAID PLACEMENT"]);
  need(locks[5],["print copy of Adventures of Huckleberry Finn"]);

  if(locks[0].querySelector("[data-module='lock-overlay']"))issues.push("Auto over-fix must appear unobscured before the checklist.");
  for(const state of [...first,locks[0],secured])if(state.querySelector("[data-module='lock-overlay']"))issues.push(`${state.id} must not show the lock overlay.`);
  for(let index=1;index<locks.length;index+=1){const overlay=locks[index].querySelector("[data-module='lock-overlay']");if(!overlay)issues.push(`${locks[index].id} is missing the lock overlay.`);else if(Number(overlay.getAttribute("data-checked"))!==index-1)issues.push(`${locks[index].id} has the wrong check count.`)}

  if(first[0].textContent.includes("published in the 1880s"))issues.push("Correct AI copy appears before the first repair.");
  if(first[0].textContent.includes("paid edition is ready"))issues.push("Initial AI overview incorrectly narrates the sponsored result below it.");
  if(!first[1].textContent.includes("published in the 1880s"))issues.push("AI correction has no visible copy change.");
  if(first[2].textContent.includes("SPONSORED PRODUCTS · PAID PLACEMENT"))issues.push("Paid label turns green before its repair.");
  if(first[3].querySelector("[data-module='library-result']")?.getAttribute("opacity")!=="0.27")issues.push("Library becomes visible before its repair.");
  if(first[4].querySelector("[data-module='bookstore-result']")?.getAttribute("opacity")!=="0.27")issues.push("Bookstore becomes visible before its repair.");
  if(first[5].querySelector("[data-results-layout='ranked']"))issues.push("Full reranking appears before the final first-run repair.");
  if(first[6].querySelector("[data-semantic-state='corrupt']"))issues.push("Fully repaired first run retains a corruption target.");
  if(first[6].querySelector(".si-rank"))issues.push("The repaired hierarchy still uses explicit numeric ranks.");
  const collapsedAi=first[2].querySelector("[data-module='ai-overview']");
  if(!collapsedAi?.hasAttribute("data-collapsed")||collapsedAi.querySelector("image")||/OPTIONAL|ADVENTURES OF HUCKLEBERRY FINN|published in the 1880s/i.test(collapsedAi?.textContent||""))issues.push("Collapsed AI overview still carries answer content, artwork, or the OPTIONAL label.");
  const finalLibrary=first[6].querySelector("[data-module='library-result'] rect")?.getBBox();
  const finalBookstore=first[6].querySelector("[data-module='bookstore-result'] rect")?.getBBox();
  if(!finalLibrary||!finalBookstore||Math.abs(finalLibrary.x-finalBookstore.x)>1||finalBookstore.y<=finalLibrary.y)issues.push("Library and bookstore are not stacked as full-width search results.");
  const freeY=first[6].querySelector("[data-module='free-online-results'] rect")?.getBBox().y;
  const paidY=first[6].querySelector("[data-module='paid-results'] rect")?.getBBox().y;
  if(!(Number.isFinite(freeY)&&Number.isFinite(paidY)&&freeY<paidY))issues.push("Free online editions are not visibly placed above the sponsored bookstore.");
  if(first[0].querySelectorAll("[data-module='edition-art']").length!==1||first[0].querySelectorAll("[data-module='ai-overview'] image").length!==1)issues.push("Initial Search-ish frame is missing the generated AI or edition artwork.");
  if(locks[0].querySelectorAll("image[href*='searchish-study-notes-v1.jpg']").length!==1)issues.push("Auto over-fix is missing the generated study-notes product art.");
  for(const state of [...first,locks[2],locks[3],locks[4],locks[5],secured])if(!state.querySelector("[data-module='view-more']"))issues.push(`${state.id} loses the below-the-fold view-more cue.`);
  if(first[6].querySelector(".si-dot"))issues.push("The free online results still use the ambiguous separator dot.");
  for(const state of [...first,locks[2],locks[3],locks[4],locks[5],secured]){
    const cue=state.querySelector("[data-module='view-more']");
    if(cue&&cue.getBBox().y+cue.getBBox().height>=675)issues.push(`${state.id} view-more cue touches the footer boundary.`);
  }
  for(const state of [locks[0],locks[1],locks[2],locks[3],locks[4]])if(!state.textContent.includes("SPONSORED")&&!state.textContent.includes("AUTO SEARCH"))issues.push(`${state.id} loses the visible sponsored-result context.`);
  if(secured.querySelector("[data-semantic-state='corrupt']")||secured.textContent.includes("AUTO ALREADY SEARCHED"))issues.push("Secured state retains Auto/corruption content.");

  const siteText=(state)=>[...state.querySelectorAll("[data-module='search-header'],[data-results-layout], [data-module='site-meter']")].map((node)=>node.textContent.replace(/\s+/g," ").trim()).join("|");
  if(siteText(first[6])!==siteText(secured))issues.push("First-run repaired and secured Search-ish site content drift apart.");
  return issues;
}));
await browser.close();

if(errors.length){errors.forEach((error)=>console.error(`ERROR: ${error}`));process.exit(1)}
console.log("PASS: Search-ish v3 — 14 states, six first-run hierarchy repairs, four asymmetric Auto locks, print-copy options, free digital sources, visible paid labeling, Auto character continuity, exact secured hierarchy, stable semantic copy, shared shell, and text bounds verified.");
