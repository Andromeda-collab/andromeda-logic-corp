from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.investors import get_investors_content, upsert_investors_content
from app.schemas.investors import InvestorsContentOut, InvestorsContentBase
from app.core.security import get_current_admin

router = APIRouter(prefix="/investors", tags=["Investors & Partners"])


@router.get("/", response_model=InvestorsContentOut)
def get_investors(db: Session = Depends(get_db)):
    content = get_investors_content(db)
    if not content:
        raise HTTPException(status_code=404, detail="Investors content not set up yet")
    return content


@router.put("/", response_model=InvestorsContentOut)
def set_investors(payload: InvestorsContentBase, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return upsert_investors_content(db, payload)