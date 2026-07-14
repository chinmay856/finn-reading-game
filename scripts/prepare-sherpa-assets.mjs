import { createHash } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { copyFile, mkdir, mkdtemp, readdir, rename, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { spawn } from "node:child_process";

export const SHERPA_VERSION = "v1.13.2";
export const SHERPA_ARCHIVE_NAME =
  "sherpa-onnx-wasm-simd-v1.13.2-en-asr-zipformer.tar.bz2";
export const SHERPA_ARCHIVE_URL =
  `https://github.com/k2-fsa/sherpa-onnx/releases/download/${SHERPA_VERSION}/${SHERPA_ARCHIVE_NAME}`;
export const SHERPA_ARCHIVE_SHA256 =
  "0ae9f835b956e43200231ad6820e6ce3c8f2225411af55c51f017266d3552caa";

export const REQUIRED_SHERPA_FILES = Object.freeze({
  "sherpa-onnx-asr.js": "d51ae8e8b756ee5e53423ffada0c9702973f154f561aca7984fe0b12f4060178",
  "sherpa-onnx-wasm-main-asr.data": "b80cd7fc7c709509fadd2a9fdcd33ea2eb4803227871a3848d7cd055d84375bf",
  "sherpa-onnx-wasm-main-asr.js": "c59ebd9facb6a779f00ab952726953b8bcb6761e56fcea483d94c5f21afcf0fe",
  "sherpa-onnx-wasm-main-asr.wasm": "2156352f91040ee972e784bb7ed8188b21e7732e3d3095cf8a2d1de535f64a12",
});

function parseSourceOverride(argv = process.argv.slice(2), env = process.env) {
  const inline = argv.find((argument) => argument.startsWith("--source="));
  if (inline) return inline.slice("--source=".length);
  const sourceIndex = argv.indexOf("--source");
  if (sourceIndex >= 0) {
    const value = argv[sourceIndex + 1];
    if (!value || value.startsWith("--")) throw new Error("--source requires a file or directory path.");
    return value;
  }
  return env.SHERPA_ASSET_SOURCE || null;
}

export async function sha256(filePath) {
  const hash = createHash("sha256");
  await pipeline(createReadStream(filePath), hash);
  return hash.digest("hex");
}

async function verifyFile(filePath, expectedDigest, label = basename(filePath)) {
  const actualDigest = await sha256(filePath);
  if (actualDigest !== expectedDigest) {
    throw new Error(
      `${label} failed SHA-256 verification: expected ${expectedDigest}, received ${actualDigest}.`,
    );
  }
}

async function downloadArchive(destination) {
  const response = await fetch(SHERPA_ARCHIVE_URL, { redirect: "follow" });
  if (!response.ok || !response.body) {
    throw new Error(`Could not download ${SHERPA_ARCHIVE_URL} (${response.status}).`);
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(destination));
}

function runTar(archivePath, extractionRoot) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn("tar", ["-xjf", archivePath, "-C", extractionRoot], {
      stdio: ["ignore", "ignore", "pipe"],
    });
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", (error) => {
      rejectPromise(new Error(`Could not start tar to extract ${archivePath}: ${error.message}`));
    });
    child.on("close", (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`Could not extract ${archivePath}: ${stderr.trim() || `tar exited ${code}`}`));
    });
  });
}

async function containsRequiredFiles(directory) {
  try {
    await Promise.all(Object.keys(REQUIRED_SHERPA_FILES).map((name) => stat(join(directory, name))));
    return true;
  } catch {
    return false;
  }
}

async function findAssetDirectory(root) {
  if (await containsRequiredFiles(root)) return root;
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const candidate = join(root, entry.name);
    if (await containsRequiredFiles(candidate)) return candidate;
  }
  throw new Error(`Could not find the four pinned sherpa-onnx files under ${root}.`);
}

async function verifyAssets(sourceDirectory) {
  await Promise.all(Object.entries(REQUIRED_SHERPA_FILES).map(([name, digest]) => (
    verifyFile(join(sourceDirectory, name), digest, name)
  )));
}

async function prepareSource(sourceOverride, workRoot) {
  if (sourceOverride) {
    const sourcePath = resolve(sourceOverride);
    const sourceStats = await stat(sourcePath);
    if (sourceStats.isDirectory()) return findAssetDirectory(sourcePath);
    if (!sourceStats.isFile()) throw new Error(`Sherpa source is not a file or directory: ${sourcePath}`);
    await verifyFile(sourcePath, SHERPA_ARCHIVE_SHA256, SHERPA_ARCHIVE_NAME);
    const extractionRoot = join(workRoot, "extracted");
    await mkdir(extractionRoot);
    await runTar(sourcePath, extractionRoot);
    return findAssetDirectory(extractionRoot);
  }

  const archivePath = join(workRoot, SHERPA_ARCHIVE_NAME);
  console.log(`Downloading pinned sherpa-onnx ${SHERPA_VERSION} archive...`);
  await downloadArchive(archivePath);
  await verifyFile(archivePath, SHERPA_ARCHIVE_SHA256, SHERPA_ARCHIVE_NAME);
  const extractionRoot = join(workRoot, "extracted");
  await mkdir(extractionRoot);
  await runTar(archivePath, extractionRoot);
  return findAssetDirectory(extractionRoot);
}

export async function prepareSherpaAssets({ source = null, projectRoot = process.cwd() } = {}) {
  const resolvedProjectRoot = resolve(projectRoot);
  const destination = resolve(resolvedProjectRoot, "dist", "sherpa", SHERPA_VERSION);
  const allowedRoot = resolve(resolvedProjectRoot, "dist", "sherpa");
  if (!destination.startsWith(`${allowedRoot}\\`) && !destination.startsWith(`${allowedRoot}/`)) {
    throw new Error(`Refusing to prepare assets outside ${allowedRoot}.`);
  }

  const workRoot = await mkdtemp(join(tmpdir(), "finn-sherpa-"));
  let staged = null;
  try {
    const sourceDirectory = await prepareSource(source, workRoot);
    await verifyAssets(sourceDirectory);
    await mkdir(allowedRoot, { recursive: true });
    staged = await mkdtemp(join(allowedRoot, `.${SHERPA_VERSION}-staged-`));
    await Promise.all(Object.keys(REQUIRED_SHERPA_FILES).map((name) => (
      copyFile(join(sourceDirectory, name), join(staged, name))
    )));
    await rm(destination, { recursive: true, force: true });
    await rename(staged, destination);
    staged = null;
    console.log(`Prepared verified sherpa-onnx ${SHERPA_VERSION} assets at ${destination}`);
    return destination;
  } finally {
    if (staged) await rm(staged, { recursive: true, force: true });
    await rm(workRoot, { recursive: true, force: true });
  }
}

async function main() {
  const source = parseSourceOverride();
  await prepareSherpaAssets({ source });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
