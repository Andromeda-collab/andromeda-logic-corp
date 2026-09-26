from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.home_content import get_home_content, upsert_home_content
from app.schemas.home_content import HomeContentOut, HomeContentBase
from app.core.security import get_current_admin

router = APIRouter(prefix="/home", tags=["Home"])


@router.get("/", response_model=HomeContentOut)
def get_home(db: Session = Depends(get_db)):
    content = get_home_content(db)
    if not content:
        raise HTTPException(status_code=404, detail="Home content not set up yet")
    return content


@router.put("/", response_model=HomeContentOut)
def set_home(payload: HomeContentBase, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return upsert_home_content(db, payload)
