from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.press import (
    get_all_press_items, get_press_item_by_slug, create_press_item,
    update_press_item, delete_press_item,
)
from app.schemas.press import PressItemOut, PressItemCreate
from app.core.security import get_current_admin

router = APIRouter(prefix="/newsroom", tags=["Newsroom & Press"])


@router.get("/", response_model=list[PressItemOut])
def list_press_items(year: int | None = None, db: Session = Depends(get_db)):
    return get_all_press_items(db, year)


@router.get("/{slug}", response_model=PressItemOut)
def get_press_item(slug: str, db: Session = Depends(get_db)):
    item = get_press_item_by_slug(db, slug)
    if not item:
        raise HTTPException(status_code=404, detail="Press item not found")
    return item


@router.post("/", response_model=PressItemOut, status_code=201)
def add_press_item(payload: PressItemCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    existing = get_press_item_by_slug(db, payload.slug)
    if existing:
        raise HTTPException(status_code=409, detail="Press item with this slug already exists")
    return create_press_item(db, payload)


@router.put("/{slug}", response_model=PressItemOut)
def edit_press_item(slug: str, payload: PressItemCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    item = get_press_item_by_slug(db, slug)
    if not item:
        raise HTTPException(status_code=404, detail="Press item not found")
    return update_press_item(db, item, payload)


@router.delete("/{slug}", status_code=204)
def remove_press_item(slug: str, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    item = get_press_item_by_slug(db, slug)
    if not item:
        raise HTTPException(status_code=404, detail="Press item not found")
    delete_press_item(db, item)