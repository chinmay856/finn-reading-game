const port = Number(process.argv[2] || 9223);
const targetUrl = process.argv[3];
const timeoutMs = Number(process.argv[4] || 180_000);
if (!targetUrl) throw new Error("Usage: node cdp-benchmark-client.mjs <port> <url> [timeoutMs]");

async function retry(fn, deadline) {
  let lastError;
  while (Date.now() < deadline) {
    try { return await fn(); } catch (error) { lastError = error; }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw lastError ?? new Error("Timed out.");
}

const deadline = Date.now() + timeoutMs;
const target = await retry(async () => {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(targetUrl)}`, { method: "PUT" });
  if (!response.ok) throw new Error(`CDP target creation failed (${response.status}).`);
  return response.json();
}, deadline);

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let nextId = 1;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  const waiter = pending.get(message.id);
  if (!waiter) return;
  pending.delete(message.id);
  if (message.error) waiter.reject(new Error(message.error.message));
  else waiter.resolve(message.result);
});
function command(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { reject, resolve });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

await command("Runtime.enable");
while (Date.now() < deadline) {
  const response = await command("Runtime.evaluate", {
    expression: "JSON.stringify({complete: document.body?.dataset?.benchmarkComplete ?? null, error: globalThis.__benchmarkError ?? null, summary: globalThis.__benchmarkSummary ?? null})",
    returnByValue: true,
  });
  const state = JSON.parse(response.result.value);
  if (state.complete === "true") {
    console.log(JSON.stringify(state.summary, null, 2));
    process.exit(0);
  }
  if (state.complete === "error") throw new Error(state.error || "Browser benchmark failed.");
  await new Promise((resolve) => setTimeout(resolve, 250));
}
socket.close();
throw new Error(`Benchmark did not finish within ${timeoutMs} ms.`);
