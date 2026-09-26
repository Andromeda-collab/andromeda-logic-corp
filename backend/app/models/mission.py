from sqlalchemy import String, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Mission(Base):
    """Case Study / Mission Story — Section 9.6. Reference-rights gate enforced (12.3)."""
    __tablename__ = "missions"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(150), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(250))
    summary: Mapped[str] = mapped_column(String(400))
    challenge: Mapped[str] = mapped_column(Text, nullable=True)
    approach: Mapped[str] = mapped_column(Text, nullable=True)
    technology_used: Mapped[str] = mapped_column(Text, nullable=True)
    outcome: Mapped[str] = mapped_column(Text, nullable=True)
    reference_rights_approved: Mapped[bool] = mapped_column(Boolean, default=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
