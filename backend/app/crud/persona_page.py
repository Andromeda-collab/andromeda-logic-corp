from sqlalchemy.orm import Session
from app.models.persona_page import PersonaPage
from app.schemas.persona_page import PersonaPageCreate


def get_all_personas(db: Session) -> list[PersonaPage]:
    return db.query(PersonaPage).all()


def get_persona_by_slug(db: Session, slug: str) -> PersonaPage | None:
    return db.query(PersonaPage).filter(PersonaPage.slug == slug).first()


def create_persona(db: Session, data: PersonaPageCreate) -> PersonaPage:
    persona = PersonaPage(**data.model_dump())
    db.add(persona)
    db.commit()
    db.refresh(persona)
    return persona


def update_persona(db: Session, persona: PersonaPage, data: PersonaPageCreate) -> PersonaPage:
    for field, value in data.model_dump().items():
        setattr(persona, field, value)
    db.commit()
    db.refresh(persona)
    return persona


def delete_persona(db: Session, persona: PersonaPage) -> None:
    db.delete(persona)
    db.commit()