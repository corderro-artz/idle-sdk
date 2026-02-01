import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const htmlPath = path.join(repoRoot, "src", "idle-sdk.web", "index.html");
const cssPath = path.join(repoRoot, "src", "idle-sdk.web", "styles.css");
const jsPath = path.join(repoRoot, "src", "idle-sdk.web", "app.js");

const html = fs.readFileSync(htmlPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const js = fs.readFileSync(jsPath, "utf8");

test("3D preview tab stacks in a single column", () => {
    assert.match(html, /tab-panel\s+preview-stack/);
    assert.match(html, /data-panel="preview"/);
});

test("Expanded model viewer dialog contains stacked controls", () => {
    assert.match(html, /model-viewer-panel/);
    assert.match(html, /model-viewer-viewport/);
    assert.match(html, /model-viewer-controls/);
});

test("Model viewer dialog body forces single-column layout", () => {
    assert.match(css, /\.model-viewer-panel\s+\.theme-body[\s\S]*display:\s*flex\s*!important/);
    assert.match(css, /\.model-viewer-panel\s+\.theme-body[\s\S]*flex-direction:\s*column/);
});

test("Expanded viewer controls have manual fallback support", () => {
    assert.match(js, /attachManualControls/);
    assert.match(js, /Orbit controls unavailable\. Basic controls enabled/);
    assert.match(js, /pointerdown/);
    assert.match(js, /rotateBy/);
});
