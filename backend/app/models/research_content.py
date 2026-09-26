from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class ResearchContent(Base):
    """Research & Innovation page overview — Section 9.5. Single-row table,
    same pattern as AboutContent."""
    __tablename__ = "research_content"

    id: Mapped[int] = mapped_column(primary_key=True)
    overview: Mapped[str] = mapped_column(Text)
    partnership_program: Mapped[str] = mapped_column(Text, nullable=True)