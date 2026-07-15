# Foundations

## Design character

Aim for quietly editorial enterprise design: confident typography, warm neutral surfaces, restrained color, crisp data presentation, and purposeful whitespace. Avoid the generic appearance of an unmodified component kit.

## Token model

Define tokens as CSS custom properties under `:root`. Separate raw palette values from semantic roles whenever the artifact is large enough to justify both.

Required semantic roles:

- Canvas, surface, elevated surface, and inset surface
- Primary text, secondary text, muted text, and inverse text
- Hairline, strong border, and focus ring
- Brand, positive, caution, critical, and informational accents
- Small, medium, and large radii
- Compact, default, and spacious gaps
- Fast and deliberate motion durations

## Typography

Use a system font stack by default. Establish a compact display scale, a readable body scale, tabular numerals for metrics, and uppercase labels only at small sizes with increased tracking. Keep narrative text between 60 and 75 characters per line.

## Composition

Build pages around one dominant spatial idea. Use alignment, grouping, and contrast before adding borders. Reserve shadows for genuine elevation. Use asymmetry selectively to create editorial character without compromising scanability.

## Anti-patterns

Avoid visual conventions that make unrelated artifacts look machine-generated:

- Do not put a thick colored border, stripe, or edge rail on the left or inline-start edge of decisions, insights, takeaways, conclusions, summaries, notices, cards, or callouts.
- Do not wrap an ordinary conclusion in a large alert-shaped box or pair it with a punctuation-mark icon. Use a strong heading, a short rule, a plain text block, or proximity to the evidence.
- Do not repeat the same bordered or tinted callout treatment across sections. Repetition should come from alignment and typography, not decorative containers.
- Reserve semantic notice components for actual warnings, failures, exceptions, approvals, or actions that require attention. Give those notices a neutral full perimeter and communicate severity with a compact label or icon inside the component.
- Do not use color as ornamental emphasis when type scale, weight, spacing, or position can establish hierarchy.

## Color

Start with warm off-white and ink rather than pure white and black. Select one memorable brand accent and one secondary accent. Treat semantic colors as meaning, not decoration. Ensure charts remain understandable without color alone.
