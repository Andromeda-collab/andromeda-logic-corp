from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.library_resource import (
    get_all_resources, get_resource_by_slug, create_resource,
    update_resource, delete_resource,
)
from app.schemas.library_resource import LibraryResourceOut, LibraryResourceCreate
from app.core.config import settings
from app.core.security import get_current_admin

router = APIRouter(prefix="/library", tags=["Technical Library"])


@router.get("/", response_model=list[LibraryResourceOut])
def list_resources(specialty: str | None = None, persona: str | None = None,
                    asset_type: str | None = None, db: Session = Depends(get_db)):
    return get_all_resources(db, specialty, persona, asset_type)


@router.get("/{resource_slug}", response_model=LibraryResourceOut)
def get_resource(resource_slug: str, db: Session = Depends(get_db)):
    resource = get_resource_by_slug(db, resource_slug)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource


@router.post("/", response_model=LibraryResourceOut, status_code=201)
def add_resource(payload: LibraryResourceCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    existing = get_resource_by_slug(db, payload.slug)
    if existing:
        raise HTTPException(status_code=409, detail="Resource with this slug already exists")
    return create_resource(db, payload)


@router.put("/{resource_slug}", response_model=LibraryResourceOut)
def edit_resource(resource_slug: str, payload: LibraryResourceCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    resource = get_resource_by_slug(db, resource_slug)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return update_resource(db, resource, payload)


@router.delete("/{resource_slug}", status_code=204)
def remove_resource(resource_slug: str, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    resource = get_resource_by_slug(db, resource_slug)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    delete_resource(db, resource)


# Stays public — this is the visitor-facing gated-download request flow,
# not a CMS write operation.
@router.post("/{resource_slug}/request-access")
def request_access(resource_slug: str, payload: dict, db: Session = Depends(get_db)):
    resource = get_resource_by_slug(db, resource_slug)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    gating_active = settings.EXPORT_CONTROL_GATING_ENABLED and resource.is_gated
    return {"resource": resource_slug, "gated": gating_active, "status": "pending_review"}