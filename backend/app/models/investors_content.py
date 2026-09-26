from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class InvestorsContent(Base):
    """Investors & Partners page content — Section 9.11. Single-row table."""
    __tablename__ = "investors_content"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_snapshot: Mapped[str] = mapped_column(Text)
    partner_program: Mapped[str] = mapped_column(Text)
    disclosures: Mapped[str] = mapped_column(Text, nullable=True)