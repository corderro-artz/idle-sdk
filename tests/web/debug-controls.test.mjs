import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const htmlPath = path.join(repoRoot, "src", "idle-sdk.web", "index.html");
const jsPath = path.join(repoRoot, "src", "idle-sdk.web", "app.js");

const html = fs.readFileSync(htmlPath, "utf8");
const js = fs.readFileSync(jsPath, "utf8");

test("Overview includes master debug controls and tick batch", () => {
    assert.match(html, /id="debugControlsToggle"/);
    assert.match(html, /id="tickBatchInput"/);
    assert.match(html, /id="tickBatchBtn"/);
    assert.match(html, /id="tickBatchTime"/);
    assert.match(html, /id="debugControlsBadge"/);
});

test("Debug controls gating exists in module and pin logic", () => {
    assert.match(js, /state\.debugControlsEnabled/);
    assert.match(js, /createPinButton[\s\S]*disabled = !state\.debugControlsEnabled/);
    assert.match(js, /renderModules[\s\S]*controlsDisabled/);
    assert.match(js, /renderContentPacks[\s\S]*controlsDisabled/);
});

test("Debug actions are guarded when controls are disabled", () => {
    assert.match(js, /saveSnapshot\(silent = false, bypassDebugGuard = false\)/);
    assert.match(js, /if \(!bypassDebugGuard && !state\.debugControlsEnabled\) return/);
    assert.match(js, /loadSnapshot\(bypassDebugGuard = false\)/);
    assert.match(js, /document\.getElementById\("tickBtn"\)\.onclick = \(\) => \{[\s\S]*!state\.debugControlsEnabled/);
});

test("Tick batch formatter uses tick rate", () => {
    assert.match(js, /formatTickDuration\(ticks, tickRate\)/);
    assert.match(js, /totalSeconds = Math\.floor\(safeTicks \/ rate\)/);
});
