from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.db.base import Base


class MissionConsultation(Base):
    """Mission Consultation form submission — Section 9.13. Primary lead-capture surface."""
    __tablename__ = "mission_consultations"

    id: Mapped[int] = mapped_column(primary_key=True)
    persona: Mapped[str] = mapped_column(String(100))
    mission_phase: Mapped[str] = mapped_column(String(100), nullable=True)
    target_orbit_or_destination: Mapped[str] = mapped_column(String(200), nullable=True)
    timeframe: Mapped[str] = mapped_column(String(100), nullable=True)
    name: Mapped[str] = mapped_column(String(200))
    organization: Mapped[str] = mapped_column(String(200))
    role: Mapped[str] = mapped_column(String(150), nullable=True)
    email: Mapped[str] = mapped_column(String(200))
    country: Mapped[str] = mapped_column(String(100))
    rfp_document_url: Mapped[str] = mapped_column(String(500), nullable=True)
    consent_given: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
