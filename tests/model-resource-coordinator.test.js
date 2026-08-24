import assert from "node:assert/strict";
import test from "node:test";

import { acquireExclusiveModelLease } from "../speech/model-resource-coordinator.js";

function createLockManager() {
  const active = new Set();
  return {
    async request(name, options, callback) {
      assert.equal(options.ifAvailable, true);
      assert.equal(options.mode, "exclusive");
      if (active.has(name)) return callback(null);
      active.add(name);
      try {
        return await callback({ name });
      } finally {
        active.delete(name);
      }
    },
  };
}

test("allows only one tab to hold the heavyweight Sherpa model lease", async () => {
  const locks = createLockManager();
  const runtime = { navigator: { locks } };
  const first = await acquireExclusiveModelLease({ runtime });
  const second = await acquireExclusiveModelLease({ runtime });
  assert.equal(first.acquired, true);
  assert.equal(first.coordinated, true);
  assert.equal(second.acquired, false);
  assert.equal(second.reason, "already-in-use");

  first.release();
  await new Promise((resolve) => setImmediate(resolve));
  const third = await acquireExclusiveModelLease({ runtime });
  assert.equal(third.acquired, true);
  third.release();
});

test("keeps single-tab compatibility when Web Locks are unavailable", async () => {
  const lease = await acquireExclusiveModelLease({ runtime: { navigator: {} } });
  assert.equal(lease.acquired, true);
  assert.equal(lease.coordinated, false);
  assert.equal(lease.reason, "web-locks-unavailable");
});

test("fails closed when a browser lock implementation throws", async () => {
  const runtime = { navigator: { locks: { request() { throw new Error("stopped"); } } } };
  const lease = await acquireExclusiveModelLease({ runtime });
  assert.equal(lease.acquired, false);
  assert.equal(lease.coordinated, true);
});
