from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.platform import (
    get_all_platforms, get_platform_by_slug, create_platform,
    update_platform, delete_platform,
)
from app.schemas.platform import PlatformOut, PlatformCreate
from app.core.security import get_current_admin

router = APIRouter(prefix="/products", tags=["Products & Platforms"])


@router.get("/", response_model=list[PlatformOut])
def list_platforms(db: Session = Depends(get_db)):
    return get_all_platforms(db)


@router.get("/{platform_slug}", response_model=PlatformOut)
def get_platform(platform_slug: str, db: Session = Depends(get_db)):
    platform = get_platform_by_slug(db, platform_slug)
    if not platform:
        raise HTTPException(status_code=404, detail="Platform not found")
    return platform


@router.post("/", response_model=PlatformOut, status_code=201)
def add_platform(payload: PlatformCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    existing = get_platform_by_slug(db, payload.slug)
    if existing:
        raise HTTPException(status_code=409, detail="Platform with this slug already exists")
    return create_platform(db, payload)


@router.put("/{platform_slug}", response_model=PlatformOut)
def edit_platform(platform_slug: str, payload: PlatformCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    platform = get_platform_by_slug(db, platform_slug)
    if not platform:
        raise HTTPException(status_code=404, detail="Platform not found")
    return update_platform(db, platform, payload)


@router.delete("/{platform_slug}", status_code=204)
def remove_platform(platform_slug: str, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    platform = get_platform_by_slug(db, platform_slug)
    if not platform:
        raise HTTPException(status_code=404, detail="Platform not found")
    delete_platform(db, platform)