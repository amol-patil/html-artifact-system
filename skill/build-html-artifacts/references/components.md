# Components

## Component contract

Each component must define its purpose, anatomy, interactive states, responsive behavior, and failure states. Prefer semantic class names for stable components and utilities for local composition.

Use the canonical `art-*` implementations in `assets/html-artifact-kit.css`. Copy anatomy from `references/component-recipes.md`; add new components by extending the same tokens and naming conventions.

## Core set

- Buttons: primary, secondary, quiet, and destructive; include busy and disabled states.
- Inputs: label, help text, validation message, and visible focus.
- Cards: use only when grouping needs a boundary; avoid wrapping every section in a card.
- Metrics: label, value, comparison, period, and optional sparkline.
- Tables: sticky headers when useful, aligned numeric cells, horizontal overflow, and a meaningful empty state.
- Filters: show active state and make reset behavior obvious.
- Tabs: use buttons with ARIA state and keyboard-operable panels.
- Callouts: use only for genuine notices, exceptions, approvals, or required actions. Keep a neutral full border; communicate tone with a compact icon or label inside the component, never a colored leading stripe.
- Dialogs: trap focus, close with Escape, restore focus, and label the dialog.
- Presentation controls: compact position toggle, disclosed previous/next panel, direct-navigation slide dots with title tooltips, keyboard shortcuts, Escape-to-close, and focus restoration.

## Data visualization

Use inline SVG for small, fixed charts. Give charts a textual title, units, and a nearby summary of the main finding. Avoid 3D effects, gradients that obscure values, and unlabeled axes. Use tabular numerals for quantitative labels.

## Icons

Use compact inline SVG with `currentColor`. Mark decorative icons `aria-hidden="true"`; give meaningful icons an accessible label. Keep stroke weight and corner treatment consistent.
