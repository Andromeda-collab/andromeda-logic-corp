from sqlalchemy import String, Text, Date, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class LibraryResource(Base):
    """Technical Library entry (whitepaper/spec sheet/briefing) — Section 9.10.
    Subject to export-control gating rule — Section 9.14 / 14.1."""
    __tablename__ = "library_resources"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300))
    asset_type: Mapped[str] = mapped_column(String(50))  # whitepaper|spec_sheet|briefing|case_study
    specialty_tag: Mapped[str] = mapped_column(String(120), nullable=True)
    persona_tag: Mapped[str] = mapped_column(String(120), nullable=True)
    is_gated: Mapped[bool] = mapped_column(Boolean, default=True)
    file_url: Mapped[str] = mapped_column(String(500), nullable=True)
    published_date: Mapped[Date] = mapped_column(Date)
