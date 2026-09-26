from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.persona_page import (
    get_all_personas, get_persona_by_slug, create_persona,
    update_persona, delete_persona,
)
from app.schemas.persona_page import PersonaPageOut, PersonaPageCreate
from app.core.security import get_current_admin

router = APIRouter(prefix="/solutions", tags=["Solutions by Audience"])


@router.get("/", response_model=list[PersonaPageOut])
def list_personas(db: Session = Depends(get_db)):
    return get_all_personas(db)


@router.get("/{persona_slug}", response_model=PersonaPageOut)
def get_persona(persona_slug: str, db: Session = Depends(get_db)):
    persona = get_persona_by_slug(db, persona_slug)
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    return persona


@router.post("/", response_model=PersonaPageOut, status_code=201)
def add_persona(payload: PersonaPageCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    existing = get_persona_by_slug(db, payload.slug)
    if existing:
        raise HTTPException(status_code=409, detail="Persona with this slug already exists")
    return create_persona(db, payload)


@router.put("/{persona_slug}", response_model=PersonaPageOut)
def edit_persona(persona_slug: str, payload: PersonaPageCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    persona = get_persona_by_slug(db, persona_slug)
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    return update_persona(db, persona, payload)


@router.delete("/{persona_slug}", status_code=204)
def remove_persona(persona_slug: str, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    persona = get_persona_by_slug(db, persona_slug)
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    delete_persona(db, persona)