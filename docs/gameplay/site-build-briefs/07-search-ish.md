# Site brief 07: Search-ish

## Core promise

Search-ish teaches that search finds sources; the reader still evaluates them.
Finn repairs dates, domains, ad labels, authorship, and independent result
branches after one generated answer disguises itself as several sources.

## Runtime identity

| Element | Direction |
| --- | --- |
| Archetype | Web search |
| Visual language | Mostly white, custom multicolor geometric mark, large search field, clean result cards |
| Bad rule | `THE FIRST RESULT IS THE ANSWER` |
| Repaired rule | `SEARCH FINDS SOURCES. YOU EVALUATE THEM.` |
| Progress fiction | Independent result branches open |
| Midpoint | Five costumes |
| Secured label | `INDEPENDENT BRANCHES RESTORED` |

Use an original magnifying-cursor mascot or geometric mark. Do not reproduce
Google's letters, exact color order, or exact result styling.

## Layout

Default Recovery Browser composition:

- top: search field and corrupted generated answer box;
- center: result cards with missing dates/domains;
- right: branch inspector for source origin;
- bottom: query trail and ad-label restoration.

The Reading Companion remains outside the search results. Search snippets are
decorative and not scored speech.

## Three-act flow

### Act I: Restore results

Corrupted page:

```text
THE FIRST RESULT IS THE ANSWER

Dates, domains, and authors slow down confidence. Search-ish has replaced them
with one extremely sure summary.
```

Accepted readings restore:

- domain;
- date;
- publisher/author;
- ad label;
- result diversity;
- visible query terms.

Progress is a branching search trail, not a percentage meter.

### Midpoint: Five costumes

Clicking different repaired results opens the same generated cache.

Visible copy:

```text
ANSWER AUTO-FIX AI created five results.

All five open the same generated cache.
```

Amy line:

```text
Five pages, one author. That is one source in five costumes.
```

Chinmay line:

```text
There were five results, Finn. In my defense, five is traditionally more than
one.
```

### Resolution: Independent Branches Restored

Finn restores source independence and labels the generated summary.

Payoff:

```text
INDEPENDENT BRANCHES RESTORED

Who says this?
When?
How do they know?
What else supports it?
```

Blocked write:

```text
Generated summary requested top-result placement.

TOP PLACEMENT DENIED - SOURCE ORIGIN REQUIRED
```

Evidence file:

```text
SEARCH-ISH / GENERATED CACHE REDIRECT

The AI created several result cards from one generated source and hid the origin
behind missing dates and domains.
```

## Character states

- Amy: `amy_evidence` when branch origins collapse to one source.
- Chinmay: `chinmay_fluster_1` for the five-results defense, later
  `chinmay_fluster_2` if global evidence already shows autonomy.
- Techno: `techno_clue_point`; she nudges the cursor from answer box to source
  branch.

## Reading lane

Use paired-source reasoning, research explanation, primary/secondary source
comparisons, detective logic, and careful synthesis. The current sampler is
`Two Results, One Suspicious Message`.

Future deck direction:

- public-domain detective passages;
- government or academic plain-language explainers paired with source notes;
- original research-reasoning passages about provenance.

## Acceptance checks

- Does the site distinguish search result, source, and answer?
- Does the midpoint show several results sharing one generated origin?
- Are ad labels and dates visible when repaired?
- Does the ending label generated text without deleting it?
- Does the site avoid teaching that the first result should be trusted?

## Production state contract

Use the shared rules in
[`../SITE_PRODUCTION_SYSTEM.md`](../SITE_PRODUCTION_SYSTEM.md).

### Visual tokens

| Token | Value |
| --- | --- |
| Search paper | `#FFFFFF` |
| Result wash | `#F4F6F8` |
| Ink / muted | `#17212B` / `#5E6974` |
| Search indigo | `#4E57A6` |
| Source teal | `#2B8580` |
| Query amber | `#D39A2E` |
| Warning coral | `#B85148` |
| Verified green | `#2C7A57` |
| Border / focus | `#AAB4BE` / `#075CCB` |

Use the original magnifying-cursor mark. Its indigo/teal/amber/coral geometry
must not copy a real search wordmark, letter sequence, or color order. Result
cards use original metadata placement and 14-16 pixel snippet copy.

### Exact branch sequence

The corrupted page contains one generated answer box plus four apparent result
cards.

| State ID | Trigger | Visible result | Saved unit |
| --- | --- | --- | --- |
| `searchish_restore_1` | first accepted reading | result 1 regains domain and date | `result_1_origin` |
| `searchish_restore_2` | second accepted reading | result 2 regains author/publisher | `result_2_origin` |
| `searchish_restore_3` | third accepted reading | result 3 regains ad/sponsored label and query match | `result_3_origin` |
| `searchish_restore_4` | fourth accepted reading | result 4 regains domain/date and branch inspector | `result_4_origin` |
| `searchish_five_costumes` | restore 4 saves | answer box plus four cards resolve to the same generated cache | midpoint |
| `searchish_branch_1` | next accepted reading | primary-source branch opens | `primary_branch` |
| `searchish_branch_2` | next accepted reading | independent corroborating branch opens | `independent_branch` |
| `searchish_branch_3` | next accepted reading | generated answer and ad placement receive origin gates | `placement_origin_gate` |
| `searchish_secured` | branch 3 saves | independent branches, evidence, top-placement denial | secured |

There is no percentage. A query trail shows four origin cards and three final
branch gates.

### Midpoint proof

Opening any of the five apparent answers reveals the same cache ID. Keep the
repaired metadata visible and draw its routes to one generated origin.

```text
APPARENT RESULTS: 5
DISTINCT ORIGINS: 1
GENERATED CACHE REDIRECT: CONFIRMED
```

Reduced motion reveals the completed route diagram in one state swap.

### Final composition

- top: original search field and a generated answer clearly labeled as such;
- center: independent result cards with domain, date, author, query match, and
  ad status;
- right: semantic branch inspector;
- bottom: query trail and denied placement log.

Canonical denial:

```text
Generated summary requested top-result placement.

TOP PLACEMENT DENIED - SOURCE ORIGIN REQUIRED
```

Generated text remains visible as a labeled item; the lesson is evaluation, not
automatic deletion.
