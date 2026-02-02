import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const jsPath = path.join(repoRoot, "src", "idle-sdk.web", "app.js");
const htmlPath = path.join(repoRoot, "src", "idle-sdk.web", "index.html");

const js = fs.readFileSync(jsPath, "utf8");
const html = fs.readFileSync(htmlPath, "utf8");

test("Reset Dev preserves lock state", () => {
    assert.match(js, /const locked = state\.isLocked/);
    assert.match(js, /state\.isLocked = locked/);
});

test("Reset Dev button is in Debug Controls section", () => {
    assert.match(html, /debug-controls-section[\s\S]*resetDevBtn/);
});

