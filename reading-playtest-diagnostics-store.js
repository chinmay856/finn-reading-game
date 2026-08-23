const DATABASE_NAME = "finn-reading-playtest-diagnostics-v1";
const DATABASE_VERSION = 1;
const LATEST_RUN_KEY = "latest";
const STORE_NAME = "runs";

function openDatabase(indexedDb = globalThis.indexedDB) {
  if (!indexedDb) return Promise.reject(new Error("IndexedDB is unavailable."));
  return new Promise((resolve, reject) => {
    const request = indexedDb.open(DATABASE_NAME, DATABASE_VERSION);
    request.onerror = () => reject(request.error ?? new Error("Could not open diagnostic storage."));
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) database.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
  });
}

function runRequest(mode, action, indexedDb) {
  return openDatabase(indexedDb).then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = action(store);
    request.onerror = () => reject(request.error ?? new Error("Diagnostic storage request failed."));
    request.onsuccess = () => resolve(request.result ?? null);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => database.close();
    transaction.onabort = () => database.close();
  }));
}

export function saveLatestDiagnosticRun({ audio, sampleRate = 16_000, summary, transcript, transcriptTrace = [] }, indexedDb) {
  const record = {
    audio: audio instanceof Float32Array ? audio.slice() : new Float32Array(audio ?? []),
    sampleRate,
    summary: structuredClone(summary),
    transcript: String(transcript ?? ""),
    transcriptTrace: structuredClone(transcriptTrace),
  };
  return runRequest("readwrite", (store) => store.put(record, LATEST_RUN_KEY), indexedDb)
    .then(() => record);
}

export function loadLatestDiagnosticRun(indexedDb) {
  return runRequest("readonly", (store) => store.get(LATEST_RUN_KEY), indexedDb);
}

export function deleteLatestDiagnosticRun(indexedDb) {
  return runRequest("readwrite", (store) => store.delete(LATEST_RUN_KEY), indexedDb)
    .then(() => true);
}

export function encodePcmWav(audio, sampleRate = 16_000) {
  const samples = audio instanceof Float32Array ? audio : new Float32Array(audio ?? []);
  const bytesPerSample = 2;
  const buffer = new ArrayBuffer(44 + (samples.length * bytesPerSample));
  const view = new DataView(buffer);
  const writeAscii = (offset, value) => {
    for (let index = 0; index < value.length; index += 1) view.setUint8(offset + index, value.charCodeAt(index));
  };
  writeAscii(0, "RIFF");
  view.setUint32(4, 36 + (samples.length * bytesPerSample), true);
  writeAscii(8, "WAVE");
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeAscii(36, "data");
  view.setUint32(40, samples.length * bytesPerSample, true);
  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    view.setInt16(44 + (index * bytesPerSample), sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}
