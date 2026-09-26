from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.about_content import get_about, upsert_about
from app.schemas.about_content import AboutContentOut, AboutContentCreate
from app.core.security import get_current_admin

router = APIRouter(prefix="/about", tags=["About Us"])


@router.get("/", response_model=AboutContentOut)
def get_about_content(db: Session = Depends(get_db)):
    about = get_about(db)
    if not about:
        raise HTTPException(status_code=404, detail="About content not set up yet")
    return about


@router.put("/", response_model=AboutContentOut)
def set_about_content(payload: AboutContentCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return upsert_about(db, payload)