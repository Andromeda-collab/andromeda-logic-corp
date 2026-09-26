from sqlalchemy import String, Text, Date, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class PressItem(Base):
    """Press Release (self-published) & External Mention — Section 9.7."""
    __tablename__ = "press_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300))
    body: Mapped[str] = mapped_column(Text, nullable=True)
    is_external: Mapped[bool] = mapped_column(Boolean, default=False)
    source_outlet: Mapped[str] = mapped_column(String(200), nullable=True)
    published_date: Mapped[Date] = mapped_column(Date)
