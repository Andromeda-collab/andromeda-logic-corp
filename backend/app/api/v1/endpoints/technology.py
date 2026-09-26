from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.specialty import (
    get_all_specialties, get_specialty_by_slug, create_specialty,
    update_specialty, delete_specialty,
)
from app.schemas.specialty import SpecialtyOut, SpecialtyCreate
from app.core.security import get_current_admin

router = APIRouter(prefix="/technology", tags=["Technology"])


@router.get("/", response_model=list[SpecialtyOut])
def list_specialties(db: Session = Depends(get_db)):
    return get_all_specialties(db)


@router.get("/{specialty_slug}", response_model=SpecialtyOut)
def get_specialty(specialty_slug: str, db: Session = Depends(get_db)):
    specialty = get_specialty_by_slug(db, specialty_slug)
    if not specialty:
        raise HTTPException(status_code=404, detail="Specialty not found")
    return specialty


@router.post("/", response_model=SpecialtyOut, status_code=201)
def add_specialty(payload: SpecialtyCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    existing = get_specialty_by_slug(db, payload.slug)
    if existing:
        raise HTTPException(status_code=409, detail="Specialty with this slug already exists")
    return create_specialty(db, payload)


@router.put("/{specialty_slug}", response_model=SpecialtyOut)
def edit_specialty(specialty_slug: str, payload: SpecialtyCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    specialty = get_specialty_by_slug(db, specialty_slug)
    if not specialty:
        raise HTTPException(status_code=404, detail="Specialty not found")
    return update_specialty(db, specialty, payload)


@router.delete("/{specialty_slug}", status_code=204)
def remove_specialty(specialty_slug: str, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    specialty = get_specialty_by_slug(db, specialty_slug)
    if not specialty:
        raise HTTPException(status_code=404, detail="Specialty not found")
    delete_specialty(db, specialty)