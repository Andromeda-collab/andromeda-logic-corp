from sqlalchemy.orm import Session
from app.models.trust_content import TrustContent
from app.schemas.trust import TrustContentBase


def get_trust_content(db: Session) -> TrustContent | None:
    return db.query(TrustContent).first()


def upsert_trust_content(db: Session, data: TrustContentBase) -> TrustContent:
    existing = get_trust_content(db)
    if existing:
        for field, value in data.model_dump().items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    record = TrustContent(**data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record