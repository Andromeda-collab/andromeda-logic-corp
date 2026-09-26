from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.job_requisition import (
    get_all_requisitions, get_requisition_by_slug, create_requisition,
    get_all_requisitions_admin, get_requisition_by_slug_admin,
    update_requisition, delete_requisition,
)
from app.schemas.job_requisition import JobRequisitionOut, JobRequisitionCreate
from app.core.security import get_current_admin

router = APIRouter(prefix="/careers", tags=["Careers"])


@router.get("/", response_model=list[JobRequisitionOut])
def list_requisitions(discipline: str | None = None, location: str | None = None,
                       db: Session = Depends(get_db)):
    return get_all_requisitions(db, discipline, location)


# Admin-only — includes closed requisitions.
@router.get("/admin/all", response_model=list[JobRequisitionOut])
def list_requisitions_admin(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return get_all_requisitions_admin(db)


@router.get("/{job_slug}", response_model=JobRequisitionOut)
def get_requisition(job_slug: str, db: Session = Depends(get_db)):
    requisition = get_requisition_by_slug(db, job_slug)
    if not requisition:
        raise HTTPException(status_code=404, detail="Job requisition not found")
    return requisition


@router.post("/", response_model=JobRequisitionOut, status_code=201)
def add_requisition(payload: JobRequisitionCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    existing = get_requisition_by_slug(db, payload.slug)
    if existing:
        raise HTTPException(status_code=409, detail="Requisition with this slug already exists")
    return create_requisition(db, payload)


@router.put("/{job_slug}", response_model=JobRequisitionOut)
def edit_requisition(job_slug: str, payload: JobRequisitionCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    requisition = get_requisition_by_slug_admin(db, job_slug)
    if not requisition:
        raise HTTPException(status_code=404, detail="Job requisition not found")
    return update_requisition(db, requisition, payload)


@router.delete("/{job_slug}", status_code=204)
def remove_requisition(job_slug: str, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    requisition = get_requisition_by_slug_admin(db, job_slug)
    if not requisition:
        raise HTTPException(status_code=404, detail="Job requisition not found")
    delete_requisition(db, requisition)