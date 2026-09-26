from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.db.base import Base


class ConsentLog(Base):
    """Cookie/privacy consent record — Section 8.3 / 14.2. Logged server-side for audit."""
    __tablename__ = "consent_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    visitor_id: Mapped[str] = mapped_column(String(100), index=True)
    necessary: Mapped[bool] = mapped_column(Boolean, default=True)
    analytics: Mapped[bool] = mapped_column(Boolean, default=False)
    marketing: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
