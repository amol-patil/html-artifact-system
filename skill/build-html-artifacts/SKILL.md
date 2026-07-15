---
name: build-html-artifacts
description: Build polished, self-contained HTML artifacts. Always use for requests to create, design, improve, or validate a dashboard, report, presentation or slides, narrative document, microsite, portal, console, operational tool, webpage, quick side artifact, or any standalone HTML deliverable, even when the user does not mention this skill. Enforces a consistent design system, portability, accessibility, and production-quality presentation without requiring a framework runtime or deployment configuration.
---

# Build HTML Artifacts

Produce work-appropriate HTML artifacts with a consistent design language, accessible behavior, responsive layouts, and no unnecessary runtime dependencies.

## Output decision

Apply HTML Artifact Kit styling and quality requirements whenever the requested deliverable is or can reasonably be a standalone HTML artifact. Treat informal phrases such as “quick dashboard,” “side artifact,” “simple report,” “slides,” “internal tool,” or “make this a webpage” as full-quality artifact requests rather than permission to return unstyled HTML. If the user explicitly requests a different format, an existing application framework, or styling from another named design system, honor that constraint instead.

## Workflow

1. Classify the request as a dashboard, narrative document, presentation, microsite, or operational interface.
2. Read `references/foundations.md`, `references/conformance.md`, and `references/quality.md` for every new artifact.
3. Start from `assets/starter.html`. Keep its version markers and use `assets/html-artifact-kit.css` as the canonical visual foundation.
4. Read the matching section in `references/artifact-types.md`.
5. Read `references/components.md` and `references/component-recipes.md` when assembling interface or data components.
6. Read `references/portability.md` before adding dependencies, data access, or embedded assets.
7. Read `references/model-compatibility.md` when packaging instructions for a particular agent or LLM.
8. Add artifact-specific CSS only after the canonical CSS. Use canonical tokens instead of introducing a competing palette, type scale, spacing system, or component style.
9. Run `scripts/bundle-html.mjs <authoring.html> <artifact.html>` to inline the canonical CSS.
10. Exercise interactions and inspect at desktop and mobile widths.
11. Run `scripts/audit-artifact.mjs <artifact.html>`. Fix every critical failure and reach at least 85/100 before delivery. If Node.js is unavailable, perform the equivalent checks in `references/conformance.md` manually.

## Non-negotiable output rules

- Deliver a complete HTML document, not a fragment.
- Preserve `data-html-artifact-kit="1.0"`, `data-artifact-kind`, and matching `html-artifact-kit` metadata.
- Keep the final artifact functional when opened directly from disk.
- Embed required CSS and JavaScript in the final HTML.
- Avoid framework runtimes, production CDNs, remote fonts, and decorative dependencies.
- Never embed credentials or private API tokens.
- Use semantic HTML, visible keyboard focus, reduced-motion support, and sufficient contrast.
- Design the information hierarchy before decorating individual components.
- Prefer a few strong compositions over a large collection of interchangeable cards.
- Never use a thick colored leading border or edge rail to style a decision, insight, takeaway, conclusion, summary, or callout. Present ordinary conclusions through typography, spacing, and placement; reserve neutral, fully bordered notices for genuine exceptions or required actions.
- Make loading, empty, error, and overflow states explicit when the artifact handles data.
- Keep print behavior intentional for reports, narrative documents, and presentations.

## Authoring guidance

Use Tailwind CSS as an optional build-time composition layer. Do not replace or duplicate the canonical token contract and component recipes. Compile Tailwind and inline its output before delivery.

Use vanilla JavaScript for local interactions. Introduce a library only when the requested behavior cannot be implemented clearly and accessibly with browser APIs.

## Completion criteria

Return the artifact only after confirming:

- It has one obvious primary purpose and visual hierarchy.
- It works at 1440 px, 1024 px, and 390 px widths.
- Keyboard navigation and focus states are usable.
- The console has no avoidable errors.
- No required resource depends on an unavailable local path.
- The final HTML contains no unresolved placeholders or build markers.
- The content is realistic enough to reveal layout problems.
