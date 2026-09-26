from sqlalchemy.orm import Session
from app.models.research_content import ResearchContent
from app.models.research_access_request import ResearchAccessRequest
from app.schemas.research import ResearchContentBase, AccessRequestCreate


def get_research_content(db: Session) -> ResearchContent | None:
    return db.query(ResearchContent).first()


def upsert_research_content(db: Session, data: ResearchContentBase) -> ResearchContent:
    existing = get_research_content(db)
    if existing:
        for field, value in data.model_dump().items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    record = ResearchContent(**data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def create_access_request(db: Session, data: AccessRequestCreate) -> ResearchAccessRequest:
    record = ResearchAccessRequest(**data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record