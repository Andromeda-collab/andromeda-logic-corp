from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.db.base import Base


class ResearchAccessRequest(Base):
    """Academic/Agency Access Request submissions — Section 9.5.
    Lightweight variant of Mission Consultation (9.13)."""
    __tablename__ = "research_access_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    institution: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(200))
    research_area: Mapped[str] = mapped_column(String(300), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)