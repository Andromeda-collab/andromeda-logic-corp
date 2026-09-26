from sqlalchemy.orm import Session
from app.models.home_content import HomeContent
from app.schemas.home_content import HomeContentBase


def get_home_content(db: Session) -> HomeContent | None:
    return db.query(HomeContent).first()


def upsert_home_content(db: Session, data: HomeContentBase) -> HomeContent:
    existing = get_home_content(db)
    if existing:
        for field, value in data.model_dump().items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    record = HomeContent(**data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
