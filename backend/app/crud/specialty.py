from sqlalchemy.orm import Session
from app.models.specialty import Specialty
from app.schemas.specialty import SpecialtyCreate


def get_all_specialties(db: Session) -> list[Specialty]:
    return db.query(Specialty).all()


def get_specialty_by_slug(db: Session, slug: str) -> Specialty | None:
    return db.query(Specialty).filter(Specialty.slug == slug).first()


def create_specialty(db: Session, data: SpecialtyCreate) -> Specialty:
    specialty = Specialty(**data.model_dump())
    db.add(specialty)
    db.commit()
    db.refresh(specialty)
    return specialty


def update_specialty(db: Session, specialty: Specialty, data: SpecialtyCreate) -> Specialty:
    for field, value in data.model_dump().items():
        setattr(specialty, field, value)
    db.commit()
    db.refresh(specialty)
    return specialty


def delete_specialty(db: Session, specialty: Specialty) -> None:
    db.delete(specialty)
    db.commit()