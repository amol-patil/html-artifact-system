import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "src", "showroom.html");
const cssPath = path.join(root, ".tmp", "artifact.css");
const canonicalCssPath = path.join(root, "skill", "build-html-artifacts", "assets", "html-artifact-kit.css");
const outputPath = path.join(root, "examples", "html-artifact-kit-showroom.html");

const [html, css, canonicalCss] = await Promise.all([
  readFile(sourcePath, "utf8"),
  readFile(cssPath, "utf8"),
  readFile(canonicalCssPath, "utf8"),
]);

const marker = "<!-- ARTIFACT_STYLES -->";
if (!html.includes(marker)) throw new Error(`Missing ${marker} in ${sourcePath}`);

const built = html.replace(marker, `<style id="html-artifact-kit-styles">${canonicalCss}</style><style id="showroom-styles">${css}</style>`);
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, built);

console.log(`Built ${path.relative(root, outputPath)} (${Math.round(Buffer.byteLength(built) / 1024)} kB)`);
