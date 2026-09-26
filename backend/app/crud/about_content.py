from sqlalchemy.orm import Session
from app.models.about_content import AboutContent
from app.schemas.about_content import AboutContentCreate


def get_about(db: Session) -> AboutContent | None:
    # Single-row pattern — always return the first (and expected only) record.
    return db.query(AboutContent).first()


def upsert_about(db: Session, data: AboutContentCreate) -> AboutContent:
    existing = get_about(db)
    if existing:
        for field, value in data.model_dump().items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    record = AboutContent(**data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record