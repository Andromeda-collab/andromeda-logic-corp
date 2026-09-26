from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.mission import (
    get_all_missions, get_mission_by_slug, create_mission,
    get_all_missions_admin, get_mission_by_slug_admin,
    update_mission, delete_mission,
)
from app.schemas.mission import MissionOut, MissionCreate
from app.core.security import get_current_admin

router = APIRouter(prefix="/missions", tags=["Case Studies & Mission Stories"])


@router.get("/", response_model=list[MissionOut])
def list_missions(db: Session = Depends(get_db)):
    return get_all_missions(db)


# Admin-only — includes drafts not yet approved for public reference rights.
@router.get("/admin/all", response_model=list[MissionOut])
def list_missions_admin(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return get_all_missions_admin(db)


@router.get("/admin/{mission_slug}", response_model=MissionOut)
def get_mission_admin(mission_slug: str, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    mission = get_mission_by_slug_admin(db, mission_slug)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission


@router.get("/{mission_slug}", response_model=MissionOut)
def get_mission(mission_slug: str, db: Session = Depends(get_db)):
    mission = get_mission_by_slug(db, mission_slug)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission


@router.post("/", response_model=MissionOut, status_code=201)
def add_mission(payload: MissionCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    existing = get_mission_by_slug(db, payload.slug)
    if existing:
        raise HTTPException(status_code=409, detail="Mission with this slug already exists")
    return create_mission(db, payload)


@router.put("/{mission_slug}", response_model=MissionOut)
def edit_mission(mission_slug: str, payload: MissionCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    mission = get_mission_by_slug_admin(db, mission_slug)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return update_mission(db, mission, payload)


@router.delete("/{mission_slug}", status_code=204)
def remove_mission(mission_slug: str, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    mission = get_mission_by_slug_admin(db, mission_slug)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    delete_mission(db, mission)