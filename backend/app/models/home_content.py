from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class HomeContent(Base):
    """Homepage hero content — Section 9.1. Single-row table."""
    __tablename__ = "home_content"

    id: Mapped[int] = mapped_column(primary_key=True)
    mission_label: Mapped[str] = mapped_column(String(100))
    mission_title: Mapped[str] = mapped_column(String(200))
    mission_description: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
