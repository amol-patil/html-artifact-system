# Component recipes

Use these recipes as stable anatomy. Adapt labels, content, and composition without replacing canonical classes.

## Metric group

```html
<section class="art-metrics" style="--art-columns:3" aria-label="Key performance indicators">
  <article class="art-metric">
    <span class="art-label">On-time delivery</span>
    <strong class="art-metric__value">96.4%</strong>
    <span class="art-metric__change art-metric__change--positive">1.8 pts above plan</span>
  </article>
</section>
```

Include a period or comparison. Do not show context-free values.

## Actions

```html
<div class="art-cluster">
  <button class="art-button art-button--primary" type="button">Publish report</button>
  <button class="art-button art-button--secondary" type="button">Save draft</button>
  <button class="art-button art-button--quiet" type="button">Preview</button>
</div>
```

Use one primary action per decision region.

## Field

```html
<div class="art-field">
  <label for="report-name">Report name</label>
  <input class="art-input" id="report-name" aria-describedby="report-help">
  <p class="art-help" id="report-help">Visible to everyone with access.</p>
</div>
```

Pair validation text with `aria-describedby` and `aria-invalid`.

## Status

```html
<span class="art-badge art-badge--positive">On track</span>
<span class="art-badge art-badge--caution">At risk</span>
<span class="art-badge art-badge--critical">Blocked</span>
```

Use text plus color. Keep status terms consistent within one artifact.

## Data table

```html
<div class="art-table-wrap">
  <table class="art-table">
    <caption class="art-meta">Carrier performance, trailing twelve weeks</caption>
    <thead><tr><th scope="col">Carrier</th><th class="art-numeric" scope="col">On time</th></tr></thead>
    <tbody><tr><th scope="row">Northline</th><td class="art-numeric">97.2%</td></tr></tbody>
  </table>
</div>
```

Keep numeric columns aligned and provide an overflow wrapper.

## Callout

```html
<aside class="art-callout art-callout--critical">
  <span aria-hidden="true">×</span>
  <div><h2>Billing export failed</h2><p>Retry the export or contact the data owner before publishing.</p></div>
</aside>
```

Use a callout only when the content is a real notice, exception, approval, or action. The canonical component has a neutral full perimeter and places semantic color on its compact marker. Never add a colored leading border or use this component to box an ordinary conclusion, insight, takeaway, or decision summary.

## Empty state

```html
<section class="art-empty">
  <div><h2 class="art-heading">No exceptions in this view</h2><p>Adjust filters or return to all active shipments.</p></div>
</section>
```

Design loading, empty, partial-data, and error states for live interfaces even if only one is initially visible.

## Presentation controls

```html
<nav class="art-presentation-controls" data-expanded="false" aria-label="Presentation navigation" data-print="hide">
  <div class="art-presentation-controls__panel" id="presentation-controls" aria-hidden="true" inert>
    <button class="art-button art-button--secondary" type="button">Previous</button>
    <div class="art-presentation-controls__dots" aria-label="Jump to slide">
      <button class="art-presentation-controls__dot" type="button" data-title="Opening argument" aria-label="Go to slide 1: Opening argument" aria-current="page"></button>
      <button class="art-presentation-controls__dot" type="button" data-title="Evidence" aria-label="Go to slide 2: Evidence"></button>
      <button class="art-presentation-controls__dot" type="button" data-title="Recommendation" aria-label="Go to slide 3: Recommendation"></button>
    </div>
    <button class="art-button art-button--primary" type="button">Next</button>
  </div>
  <button class="art-button art-button--secondary art-presentation-controls__toggle" type="button" aria-expanded="false" aria-controls="presentation-controls" aria-label="Open presentation controls">
    <span>1 / 12</span><span aria-hidden="true">⌃</span>
  </button>
</nav>
```

Keep the controls collapsed by default so the slide owns the canvas. Generate one dot per slide from its real title; put that title in `data-title` for the visual tooltip and in `aria-label` for assistive technology. Set `aria-current="page"` only on the active dot. Toggle `data-expanded`, `aria-expanded`, `aria-hidden`, and `inert` together. Escape closes the panel and returns focus to the toggle; choosing Previous, Next, or a slide dot navigates, collapses the panel, and restores focus. Preserve Arrow Left/Right, Page Up/Down, Home, and End shortcuts independently of the disclosure.
