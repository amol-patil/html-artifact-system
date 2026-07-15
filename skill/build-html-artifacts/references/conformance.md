# Conformance contract

HTML Artifact Kit 1.0 uses a portable, versioned visual contract. Apply it to every generated artifact so different models produce work that belongs to the same family.

## Required markers

Keep these markers in the authoring and final document:

```html
<html lang="en" data-html-artifact-kit="1.0" data-artifact-kind="dashboard">
<meta name="html-artifact-kit" content="1.0">
```

Set `data-artifact-kind` to `dashboard`, `document`, `presentation`, `operational`, or `microsite`.

The final document must contain:

```html
<style id="html-artifact-kit-styles">/* canonical CSS */</style>
```

## Canonical source

Use `assets/html-artifact-kit.css` without rewriting its token values or base component rules. Add artifact-specific CSS in a second inline style block or after the canonical content. Reference `--art-*` variables from custom rules.

Use `assets/starter.html` for authoring. Keep `html-artifact-kit.css` beside it while working, then run:

```sh
node scripts/bundle-html.mjs authoring.html artifact.html
```

The bundler replaces the marked stylesheet link with canonical inline CSS.

## Allowed variation

Change composition, density, content, chart geometry, and the amount of whitespace to suit the artifact. Create new semantic classes for artifact-specific regions. Do not introduce a competing palette, font stack, radius scale, focus treatment, button language, or status system.

Do not introduce thick colored leading borders or edge rails on classes for decisions, insights, takeaways, conclusions, summaries, notices, or callouts. The audit treats this as a critical visual-system failure.

## Audit

Run:

```sh
node scripts/audit-artifact.mjs artifact.html
```

Require all critical checks and a score of at least 85/100. The audit covers portability, identity, document structure, accessibility, and resilience. It does not replace visual review at 1440, 1024, and 390 pixels or the human scorecard.
