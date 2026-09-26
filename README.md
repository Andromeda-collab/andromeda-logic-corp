# Andromeda Logic Corp — Corporate Website

Project scaffold generated from the *Website Technical Specification v1.0*
(August 2026). This is a **structural skeleton** — folder layout, config,
routing, models, and endpoint stubs matching the spec's sitemap (Section 6),
module breakdown (Section 9), and NOVA AI assistant spec (Section 10).
Business logic, styling, and content are left as `TODO`s for the dev team.

## Stack

| Layer    | Choice                          |
|----------|----------------------------------|
| Frontend | React + Vite (npm)               |
| Backend  | FastAPI                          |
| Database | MySQL (SQLAlchemy + Alembic)     |

## Structure

```
andromeda-logic-corp/
├── frontend/       # React + Vite app
│   └── src/
│       ├── pages/        # 13 page templates (Section 9) + detail routes
│       ├── components/   # common/ (header, footer, cookie consent),
│       │                 # ui/ (Button, Card, StatusBadge, Accordion...),
│       │                 # nova/ (NOVA launcher + panel)
│       ├── layouts/       # MainLayout wiring global modules (Section 8)
│       ├── router/        # route map mirroring Section 6.3 URL structure
│       ├── services/      # API clients, one per module
│       └── styles/        # design tokens from Section 7.2 (colors, type)
├── backend/        # FastAPI app
│   └── app/
│       ├── api/v1/endpoints/  # one router per Section 9 page family + NOVA
│       ├── models/            # SQLAlchemy models per content type (12.2)
│       ├── schemas/           # Pydantic request/response schemas (empty, TODO)
│       ├── crud/              # DB access layer (empty, TODO)
│       ├── services/          # nova_service.py — RAG/LLM integration stub
│       ├── core/               # settings (config.py)
│       └── db/                  # session/engine, declarative base
│   └── alembic/                 # migrations, wired to app models
├── database/
│   ├── schema.sql   # hand-readable MySQL schema mirroring the models
│   └── seed.sql     # seed stub for the 5 specialties / 5 platforms / 4 personas
└── docs/            # drop the client's spec PDF here for team reference
```

## Getting Started

### 1. Database (MySQL)

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

Or let Alembic manage it once models stabilize:

```bash
cd backend
cp .env.example .env   # set DATABASE_URL
alembic revision --autogenerate -m "init schema"
alembic upgrade head
```

### 2. Backend (FastAPI)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # fill in DATABASE_URL, NOVA_LLM_API_KEY, etc.
uvicorn app.main:app --reload
```

API docs at `http://localhost:8000/docs`. Health check at `/health`.

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env      # set VITE_API_BASE_URL
npm run dev
```

App at `http://localhost:5173`. Vite dev server proxies `/api` calls to the
FastAPI backend (see `vite.config.js`).

## Spec Cross-Reference

| Spec Section | Where it lives here |
|---|---|
| 6. Information Architecture & Sitemap | `frontend/src/router/AppRouter.jsx` |
| 7. Visual Design System | `frontend/src/styles/tokens.css` |
| 8. Global Modules | `frontend/src/layouts/MainLayout.jsx`, `components/common/` |
| 9. Page-by-Page Feature Breakdown | `frontend/src/pages/*`, `backend/app/api/v1/endpoints/*` |
| 10. NOVA AI Mission Assistant | `frontend/src/components/nova/`, `backend/app/services/nova_service.py`, `backend/app/api/v1/endpoints/nova.py` |
| 11. Technical Architecture | This repo's stack choices (frontend/backend/database) |
| 12. Content Management & Governance | `backend/app/models/*` (taxonomy fields per 12.2) |
| 14. Security, Privacy & Export Control | `backend/app/core/config.py` (`EXPORT_CONTROL_GATING_ENABLED`), `library.py` endpoint |

## Open Items Before Real Development

See Section 18.3 of the spec (Open Questions for Stakeholder Review) —
certifications to publish, mission/partner reference-rights, NOVA's LLM
vendor, "NOVA" trademark clearance, and Phase 2 target languages.
