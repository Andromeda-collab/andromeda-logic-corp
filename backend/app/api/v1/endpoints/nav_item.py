from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.nav_item import (
    get_all_nav_items, get_nav_item, create_nav_item,
    update_nav_item, delete_nav_item,
)
from app.schemas.nav_item import NavItemOut, NavItemCreate
from app.core.security import get_current_admin

# Header nav links + CTA button — Section 8.1. Public GET so the Header can
# render current content; writes are admin-only, same pattern as /technology.
router = APIRouter(prefix="/navigation", tags=["Navigation"])


@router.get("/", response_model=list[NavItemOut])
def list_nav_items(db: Session = Depends(get_db)):
    return get_all_nav_items(db)


@router.get("/{nav_item_id}", response_model=NavItemOut)
def get_nav_item_by_id(nav_item_id: int, db: Session = Depends(get_db)):
    nav_item = get_nav_item(db, nav_item_id)
    if not nav_item:
        raise HTTPException(status_code=404, detail="Nav item not found")
    return nav_item


@router.post("/", response_model=NavItemOut, status_code=201)
def add_nav_item(payload: NavItemCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return create_nav_item(db, payload)


@router.put("/{nav_item_id}", response_model=NavItemOut)
def edit_nav_item(nav_item_id: int, payload: NavItemCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    nav_item = get_nav_item(db, nav_item_id)
    if not nav_item:
        raise HTTPException(status_code=404, detail="Nav item not found")
    return update_nav_item(db, nav_item, payload)


@router.delete("/{nav_item_id}", status_code=204)
def remove_nav_item(nav_item_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    nav_item = get_nav_item(db, nav_item_id)
    if not nav_item:
        raise HTTPException(status_code=404, detail="Nav item not found")
    delete_nav_item(db, nav_item)
