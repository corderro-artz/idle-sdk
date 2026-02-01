import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const jsPath = path.join(repoRoot, "src", "idle-sdk.web", "app.js");
const htmlPath = path.join(repoRoot, "src", "idle-sdk.web", "index.html");

const js = fs.readFileSync(jsPath, "utf8");
const html = fs.readFileSync(htmlPath, "utf8");

test("Reset Dev preserves lock and sandbox state", () => {
    assert.match(js, /const locked = state\.isLocked/);
    assert.match(js, /const sandbox = state\.sandboxEnabled/);
    assert.match(js, /state\.isLocked = locked/);
    assert.match(js, /state\.sandboxEnabled = sandbox/);
});

test("Sandbox and Lock toggles include clarification text", () => {
    assert.match(html, /Sandbox: enables safe experimentation/);
    assert.match(html, /Lock: pauses simulation ticks/);
});
