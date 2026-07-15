# Portability and data

## Delivery contract

Treat the final artifact as a self-contained HTML document. Inline compiled CSS and local JavaScript. Embed small required images as data URLs or inline SVG. Prefer system fonts.

## Authoring dependencies

Build-time tools are allowed when they leave no runtime requirement. Tailwind CSS, minifiers, and validators belong in the authoring workflow, not in the delivered page.

## Data modes

1. Embedded: include a JSON snapshot for demos, reports, and archival output.
2. Public API: fetch anonymous data when CORS and availability are acceptable.
3. Authenticated proxy: call a trusted backend that owns credentials and authorization.

Never embed database credentials, private API keys, or long-lived tokens. Explain when a live artifact requires a backend boundary.

## Degradation

Keep the primary content understandable if optional JavaScript fails. Provide visible error messages for failed requests. For print-oriented artifacts, render core content in the initial document rather than constructing everything after load.
