# APEX Studio

APEX Studio is a high-fidelity semi-functional prototype for Engati pre-sales, onboarding, and solution teams.

Primary message: **Turn website intent into qualified leads.**

It converts client context plus website goal into a demo-ready package containing:
- Downloadable PDF mind map / proposal
- Interactive demo website (APEX Overlay, APEX Assist, APEX Page)
- Implementation brief
- Analytics event plan
- Integration readiness plan
- Qualification logic and guardrails
- Production readiness checklist

## Tech stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Hind font (`next/font/google`) with Inter/system fallback
- Lucide React icons
- React Flow (mind map preview)
- `@react-pdf/renderer` (real downloadable PDF)
- Zod schema validation
- Local JSON persistence via API routes

## Local setup
```bash
npm install
npm run dev
```

Production build:
```bash
npm run build
```

Optional type check:
```bash
npm run typecheck
```

## Routes
Core routes:
- `/` landing page (output-led, premium hero)
- `/studio` 5-step APEX Studio builder with Simple/Advanced toggle
- `/output/[projectId]` generated package dashboard
- `/demo/[projectId]` interactive demo website (APEX Overlay, Assist, Page)

Supporting routes:
- `/output` recent demos
- `/journeys` journey library
- `/guardrails` guardrail library
- `/analytics-events` analytics reference

API routes:
- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/[projectId]`
- `POST /api/projects/[projectId]/duplicate`
- `POST /api/projects/[projectId]/simulate-payload`

## Studio flow
`/studio` is a **5-step guided flow** (consolidated from 8 steps in V1):
1. Client & Goal — client name, industry, website/page URL, business goal, target segment
2. Journeys & Qualification — journey selection + lead score/threshold/field mapping (tabbed sub-steps)
3. Experience & Brand — APEX mode selection + brand/tone/colors (tabbed sub-steps)
4. Knowledge, Guardrails & Handoff — knowledge sources, allowed actions, prompt configuration
5. Review & Generate — pre-generation audit and package generation with live progress

The flow includes:
- **Simple/Advanced toggle** (header button): Simple mode uses defaults; Advanced unlocks score model editors, prompt overrides
- Tabbed sub-steps: Journeys tab + Qualification tab in step 2; Modes tab + Brand tab in step 3
- Sticky bottom action bar with Back / Save Draft / Continue / Generate
- Live package readiness panel in right sidebar
- Website analysis is simulated and auto-applied (not a blocking step)

## Insurance hero path
Insurance is implemented as the deepest path with default client `NovaSure Insurance`, detailed journey templates, guardrails, qualification scoring, and full end-state lead handoff simulation.

## Demo modes
`/demo/[projectId]` includes a shared deterministic conversation engine across:
- **APEX Overlay**: centered 80% modal over blurred native site (not chatbot widget)
- **APEX Assist**: native form-heavy vs assisted before/after comparison
- **APEX Page**: generated AI-first conversion landing page

All three modes can reach final business payoff:
- qualified lead state
- CRM push simulated
- WhatsApp handoff ready
- payload preview + analytics events

## PDF generation
PDF export uses `@react-pdf/renderer` and produces a real `.pdf` file including:
- Cover + executive summary
- **Visual mind map**: SVG nodes and edges rendered using `Circle`, `Line`, `G` primitives from `@react-pdf/renderer` — 12-node radial diagram with group-colored nodes and labeled branches
- Recommended journeys + qualification logic (per-journey score model, thresholds, field mapping)
- Experience modes comparison
- Analytics funnel event table
- Integration plan
- Implementation roadmap (phase scope, dependencies)
- Risk & dependency matrix
- Production readiness checklist
- Open questions + final recommendation

The PDF is generated client-side without server round-trips.

## Local data persistence
Projects are stored in:
- `.apex-data/projects.json`

Behavior:
- `.apex-data` is auto-created if missing
- malformed JSON is safely recovered
- refresh-safe for `/output/[projectId]` and `/demo/[projectId]`

## Simulated vs real
### Simulated in this prototype
- Website/page analysis signals
- CRM/WhatsApp/integration pushes
- Payload validation responses
- Knowledge ingestion and parsing

### Real in this prototype
- End-to-end project generation
- Local persistence and project retrieval
- Multi-step builder and output dashboard
- Interactive conversation state machine across three demo modes
- Real downloadable PDF generation

## LLM provider abstraction
Current default is a rule-based mock provider (`lib/llm/mockProvider.ts`) so the app runs without API keys.

To connect a real LLM later:
1. Implement a provider in `lib/llm/provider.ts`
2. Keep request/response shape from `lib/llm/types.ts`
3. Swap provider selection logic while preserving fallback behavior and guardrails

## CRM/API integration path (future)
To connect production integrations later:
1. Replace simulated payload route logic with live connector services
2. Add credentials management and secrets handling
3. Finalize CRM field mapping and event contracts
4. Validate WhatsApp templates and escalation routing
5. Add retry queues and monitoring for integration failures

## Known limitations
- No authentication or role access control
- No database (file storage only)
- Analysis and integrations are simulated
- No real scraping, CRM, WhatsApp, or external APIs
- Conversation logic is deterministic for demo reliability

## Production next steps
1. Add auth, tenancy, and audit logging
2. Move storage from JSON file to production database
3. Integrate real CRM and messaging connectors
4. Add compliance workflows and approval states
5. Add contract testing for integration payloads
6. Expand analytics export and observability

---
This repository is intentionally positioned as a **high-fidelity semi-functional prototype** for internal and selected client demo use.
