from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.admin_user import get_admin_by_email
from app.schemas.admin_user import LoginRequest, TokenResponse, AdminUserOut
from app.core.security import verify_password, create_access_token, get_current_admin
from app.models.admin_user import AdminUser

router = APIRouter(prefix="/auth", tags=["Admin Auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    # Trim accidental whitespace from copy/paste (common source of "wrong
    # password" reports) — case is preserved since bcrypt comparison is
    # intentionally case-sensitive.
    email = payload.email.strip().lower()
    password = payload.password.strip()
    admin = get_admin_by_email(db, email)
    if not admin or not verify_password(password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    token = create_access_token(subject=str(admin.id))
    return TokenResponse(access_token=token, admin=AdminUserOut.model_validate(admin))


@router.get("/me", response_model=AdminUserOut)
def me(admin: AdminUser = Depends(get_current_admin)):
    return admin
