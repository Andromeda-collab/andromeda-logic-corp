from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class AboutContent(Base):
    """About Us page content — Section 9.9. Single-row table."""
    __tablename__ = "about_content"

    id: Mapped[int] = mapped_column(primary_key=True)
    mission_statement: Mapped[str] = mapped_column(Text)
    vision_statement: Mapped[str] = mapped_column(Text)
    leadership: Mapped[str] = mapped_column(Text, nullable=True)  # JSON-encoded list
    heritage_timeline: Mapped[str] = mapped_column(Text, nullable=True)  # JSON-encoded list

    locations: Mapped[str] = mapped_column(Text, nullable=True)  # JSON-encoded list