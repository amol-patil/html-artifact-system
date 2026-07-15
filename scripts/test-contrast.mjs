import { readFile } from "node:fs/promises";
import path from "node:path";

const css = await readFile(path.join(process.cwd(), "skill", "build-html-artifacts", "assets", "html-artifact-kit.css"), "utf8");

function block(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`Missing CSS block: ${selector}`);
  return match[1];
}

function token(source, name) {
  const match = source.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"));
  if (!match) throw new Error(`Missing token: --${name}`);
  return match[1];
}

function luminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map(value => parseInt(value, 16) / 255);
  const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function ratio(first, second) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

const modes = [
  ["light", block(":root")],
  ["dark", block('[data-theme="dark"]')]
];

let failed = false;
for (const [mode, source] of modes) {
  const foreground = token(source, "art-ink-inverse");
  for (const backgroundName of ["art-brand", "art-brand-strong"]) {
    const background = token(source, backgroundName);
    const score = ratio(foreground, background);
    const passed = score >= 4.5;
    console.log(`${passed ? "✓" : "✗"} ${mode} primary button on --${backgroundName}: ${score.toFixed(2)}:1`);
    failed ||= !passed;
  }
}

if (failed) process.exitCode = 1;
