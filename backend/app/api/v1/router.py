from fastapi import APIRouter

from app.api.v1.endpoints import (
    technology,
    products,
    solutions,
    research,
    missions,
    newsroom,
    careers,
    about,
    library,
    investors,
    contact,
    trust,
    nova,
    home,
    auth,
    uploads,
    nav_item,
)

# Aggregates all module routers under /api/v1 — mirrors Section 6.1 sitemap.
api_router = APIRouter()
api_router.include_router(technology.router)
api_router.include_router(products.router)
api_router.include_router(solutions.router)
api_router.include_router(research.router)
api_router.include_router(missions.router)
api_router.include_router(newsroom.router)
api_router.include_router(careers.router)
api_router.include_router(about.router)
api_router.include_router(library.router)
api_router.include_router(investors.router)
api_router.include_router(contact.router)
api_router.include_router(trust.router)
api_router.include_router(nova.router)
api_router.include_router(home.router)
api_router.include_router(auth.router)
api_router.include_router(uploads.router)
api_router.include_router(nav_item.router)
