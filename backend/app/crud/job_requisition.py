from sqlalchemy.orm import Session
from app.models.job_requisition import JobRequisition
from app.schemas.job_requisition import JobRequisitionCreate


def get_all_requisitions(db: Session, discipline: str | None = None, location: str | None = None):
    query = db.query(JobRequisition).filter(JobRequisition.is_open == True)  # noqa: E712
    if discipline:
        query = query.filter(JobRequisition.discipline == discipline)
    if location:
        query = query.filter(JobRequisition.location == location)
    return query.all()


def get_requisition_by_slug(db: Session, slug: str) -> JobRequisition | None:
    return db.query(JobRequisition).filter(JobRequisition.slug == slug).first()


def create_requisition(db: Session, data: JobRequisitionCreate) -> JobRequisition:
    requisition = JobRequisition(**data.model_dump())
    db.add(requisition)
    db.commit()
    db.refresh(requisition)
    return requisition


# Admin-facing lookups include closed requisitions.
def get_all_requisitions_admin(db: Session) -> list[JobRequisition]:
    return db.query(JobRequisition).all()


def get_requisition_by_slug_admin(db: Session, slug: str) -> JobRequisition | None:
    return db.query(JobRequisition).filter(JobRequisition.slug == slug).first()


def update_requisition(db: Session, requisition: JobRequisition, data: JobRequisitionCreate) -> JobRequisition:
    for field, value in data.model_dump().items():
        setattr(requisition, field, value)
    db.commit()
    db.refresh(requisition)
    return requisition


def delete_requisition(db: Session, requisition: JobRequisition) -> None:
    db.delete(requisition)
    db.commit()