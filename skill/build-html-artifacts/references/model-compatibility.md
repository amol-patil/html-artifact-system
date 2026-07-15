# Model compatibility

Keep canonical instructions independent of any provider, model, IDE, or tool name. Describe outcomes and filesystem operations in plain language. Treat provider packages as discovery adapters that point to `SKILL.md` and its references.

## Capability negotiation

Before using a tool, determine whether the environment can edit files, run commands, inspect a browser, or return only text. Use the strongest available workflow, but preserve these fallbacks:

- No browser control: provide a manual viewport and interaction checklist.
- No shell: return a complete HTML document and explicit save instructions.
- No package manager: write plain CSS or use a previously compiled starter.
- No filesystem: emit one fenced HTML block without splitting the artifact.

## Prompt design

Use direct imperatives, explicit acceptance criteria, and small examples. Avoid hidden chain-of-thought requests, provider-specific XML conventions, and assumptions about tool-call syntax. Keep references modular so models can load only the material relevant to the artifact type.

Put cross-model visual prohibitions in three places: a direct rule in `SKILL.md`, the canonical component implementation, and a deterministic audit check. Do not rely on taste language alone when a recurring pattern must be prevented across providers or harnesses.
