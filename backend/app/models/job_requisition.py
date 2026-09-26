from sqlalchemy import String, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class JobRequisition(Base):
    """Careers listing, synced from ATS — Section 9.8 / 11.4."""
    __tablename__ = "job_requisitions"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(250))
    discipline: Mapped[str] = mapped_column(String(120))  # GNC, ML/AI, Embedded Systems...
    location: Mapped[str] = mapped_column(String(150), nullable=True)
    requires_clearance: Mapped[bool] = mapped_column(Boolean, default=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    is_open: Mapped[bool] = mapped_column(Boolean, default=True)
