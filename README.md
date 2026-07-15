# HTML Artifact Kit

An agent- and model-agnostic design system for creating polished, portable, self-contained HTML artifacts.

Build dashboards, narrative reports, presentations, microsites, and operational tools that open directly in a browser and deploy without a framework runtime, CDN, or build configuration.

## Why this exists

A detailed prompt can produce one attractive page. A design system makes quality repeatable.

HTML Artifact Kit gives an agent the same foundations, canonical CSS, component recipes, artifact-specific composition guidance, portability contract, and validation checks on every run. The result is a consistent visual language without locking the user to a particular model or agent harness.

## Install

Requirements:

- Node.js 18 or newer
- A local agent harness that supports Agent Skills or can read a `SKILL.md` folder

Install for all supported harnesses:

```sh
npx --yes --package github:amol-patil/html-artifact-kit#v1.0.0 html-artifact install --harness all
```

The installer places one canonical copy in `~/.agents/skills/build-html-artifacts` and links harness-specific locations to it. Restart the harness or open a new conversation after installation.

### Supported harnesses

| Harness | Discovery | Explicit invocation |
|---|---|---|
| Codex | `~/.agents/skills` | `$build-html-artifacts` |
| Claude Code | `~/.claude/skills` | `/build-html-artifacts` |
| Gemini CLI | `~/.agents/skills` | `/skills list` |
| Pi | `~/.agents/skills` | `/skill:build-html-artifacts` |
| Cursor | `~/.agents/skills` | `/build-html-artifacts` |
| Antigravity | Linked global skills directory | `/build-html-artifacts` |

The installer accepts `all`, `codex`, `claude`, `gemini`, `pi`, `cursor`, `antigravity`, and `generic` as harness presets.

### Install for one project

Run this from the project root:

```sh
npx --yes --package github:amol-patil/html-artifact-kit#v1.0.0 html-artifact install --scope project --harness all
```

### Install for another harness

Point the installer at any Agent Skills-compatible directory:

```sh
npx --yes --package github:amol-patil/html-artifact-kit#v1.0.0 html-artifact install --target /path/to/harness/skills
```

## Use

Ask naturally. Explicitly naming the skill is optional:

```text
Build an executive dashboard for a regional logistics company.
```

```text
Create a board-ready HTML report explaining the decline in customer retention.
```

```text
Make a seven-section quarterly review presentation with keyboard navigation and print-to-PDF.
```

```text
Build a quick incident operations console with realistic embedded data.
```

The skill is designed to activate for dashboards, reports, slides, narrative documents, webpages, microsites, portals, operational tools, and quick side artifacts. Words such as “quick” or “simple” do not reduce the design or accessibility standard.

## What every artifact gets

- HTML Artifact Kit 1.0 visual foundations and canonical CSS
- Responsive behavior at desktop, tablet, and mobile widths
- Semantic HTML, visible focus, reduced-motion support, and labeled controls
- Embedded CSS and JavaScript with no production CDN dependency
- Intentional print behavior for documents and presentations
- Artifact-specific composition instead of a generic grid of cards
- A deterministic conformance audit and a separate human design scorecard

Tailwind CSS is available as an optional authoring tool. It is compiled at build time and never becomes a runtime requirement of the delivered HTML.

## How it is organized

```text
skill/build-html-artifacts/
├── SKILL.md                 Core workflow and activation contract
├── assets/
│   ├── html-artifact-kit.css  Canonical visual system
│   └── starter.html         Portable authoring template
├── references/              Foundations, components, artifact types, and quality
├── scripts/                 Bundler, validator, and conformance auditor
└── agents/openai.yaml       Optional Codex and ChatGPT interface metadata
```

The canonical skill is provider-neutral. Harness adapters and installer links only handle discovery; they do not change the design instructions.

## Validate an artifact

From a checkout of this repository:

```sh
node skill/build-html-artifacts/scripts/audit-artifact.mjs path/to/artifact.html
```

Artifacts must reach at least 85/100 with no critical failures. The reference showroom scores 100/100.

Audit a directory:

```sh
npm run audit:dir -- /absolute/path/to/trials
```

## Update

Install a newer tagged release and allow replacement of the existing canonical copy:

```sh
npx --yes --package github:amol-patil/html-artifact-kit#v1.1.0 html-artifact install --harness all --force
```

Using release tags keeps installations reproducible. Replace `v1.1.0` with the version you want to install.

## Develop locally

```sh
git clone https://github.com/amol-patil/html-artifact-kit.git
cd html-artifact-kit
npm install
npm run check
open examples/html-artifact-kit-showroom.html
```

Useful commands:

```sh
npm run check              # build and run all validation
npm run test:installer     # test isolated cross-harness installation
npm run eval:prompts -- x  # print clean evaluation prompts
npm run pack:check         # inspect the distributable package
```

## Security

Agent Skills can contain instructions and executable scripts. Review third-party skills before installing them. This skill's scripts operate on local HTML files and do not require credentials, model APIs, or network access.

## License

[MIT](LICENSE) © 2026 HTML Artifact Kit contributors
