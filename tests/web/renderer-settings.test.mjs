import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const jsPath = path.join(repoRoot, "src", "idle-sdk.web", "app.js");
const js = fs.readFileSync(jsPath, "utf8");

test("Module storage is single source for renderer settings", () => {
    assert.match(js, /function restoreModuleState\([\s\S]*renderFpsCap/);
    assert.match(js, /renderFpsCap === 0[\s\S]*DEFAULT_RENDER_FPS_CAP/);
    assert.doesNotMatch(js, /snapshot\?\.moduleState/);
    assert.doesNotMatch(js, /moduleState:\s*\{\s*modules/);
});

test("Renderer module exposes FPS target property", () => {
    assert.match(js, /id:\s*"renderer"[\s\S]*id:\s*"fpsCap"/);
    assert.match(js, /id:\s*"renderer"[\s\S]*id:\s*"displaySync"/);
});

test("Diagnostics use module-backed FPS target", () => {
    assert.match(js, /FPS Target[\s\S]*state\.renderFpsCap/);
});
