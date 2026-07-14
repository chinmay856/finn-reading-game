# ADR-004 — Serve the pinned streaming runtime from one isolated origin

## Status

Accepted for the Sherpa production preview on 2026-07-14.

## Context

The proven sherpa-onnx browser build requires `SharedArrayBuffer`, so the top
document must be cross-origin isolated. The current GitHub Pages deployment
does not return the required COOP, COEP, or CORP response headers. Its normal
Git path also cannot carry the pinned runtime's 190,951,044-byte data file.

Cloudflare Pages and Workers Static Assets can set the headers but cap an
individual static asset at 25 MiB. A Pages plus R2 or Worker proxy design would
work, but it creates two storage paths and another response layer before the
Reading Engine has passed its first production-origin test.

## Decision

Use Firebase Hosting as the isolated speech preview origin. It can serve the
app and the approximately 194 MiB pinned Sherpa payload from one HTTPS origin,
supports the required response headers, and accepts individual files up to
2 GB.

The repository stores only a checksum-pinned preparation script. It downloads
the exact sherpa-onnx `v1.13.2` release archive (or consumes a local copy),
verifies the archive and each required runtime file, and places the verified
files under `dist/sherpa/v1.13.2/`. The generated binary payload remains out of
Git.

Firebase must return these headers for every app and runtime response:

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-origin
```

On an isolated origin the app requests the local streaming guide by default.
`?streamingGuide=0` remains an explicit diagnostic disable switch. A host that
does not satisfy isolation, including GitHub Pages, keeps the existing honest
Whisper checkpoint fallback without downloading Sherpa.

## Consequences

- The first isolated load downloads roughly 194 MiB of Sherpa assets in
  addition to the final Whisper model. Small versioned runtime files remain
  immutable HTTP resources; the exact 190,951,044-byte data package is streamed
  into versioned OPFS because live Chrome did not commit it to Cache Storage.
  HTML always revalidates.
- Firebase is the primary isolated test link. GitHub Pages remains a
  non-isolated Whisper-only fallback while fixture, microphone, privacy, and
  failure-path gates finish.
- Hosting transfer must be monitored. A future Cloudflare Worker plus R2 path
  may be justified if distribution grows enough to outweigh its complexity.
- The Apache-2.0 license and runtime/model attribution ship with the deployment.
- Whisper remains the only final-scoring authority. Hosting does not merge the
  live guide with scoring, game rules, content, or wrapper state.
