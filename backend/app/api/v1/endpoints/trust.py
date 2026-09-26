from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.trust import get_trust_content, upsert_trust_content
from app.schemas.trust import TrustContentOut, TrustContentBase
from app.core.security import get_current_admin

router = APIRouter(prefix="/trust", tags=["Trust, Compliance & Export Control"])


@router.get("/", response_model=TrustContentOut)
def get_trust(db: Session = Depends(get_db)):
    content = get_trust_content(db)
    if not content:
        raise HTTPException(status_code=404, detail="Trust content not set up yet")
    return content


@router.put("/", response_model=TrustContentOut)
def set_trust(payload: TrustContentBase, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return upsert_trust_content(db, payload)