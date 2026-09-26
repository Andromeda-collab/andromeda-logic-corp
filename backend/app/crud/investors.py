from sqlalchemy.orm import Session
from app.models.investors_content import InvestorsContent
from app.schemas.investors import InvestorsContentBase


def get_investors_content(db: Session) -> InvestorsContent | None:
    return db.query(InvestorsContent).first()


def upsert_investors_content(db: Session, data: InvestorsContentBase) -> InvestorsContent:
    existing = get_investors_content(db)
    if existing:
        for field, value in data.model_dump().items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    record = InvestorsContent(**data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record