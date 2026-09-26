from sqlalchemy import String, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from app.models.shared import StatusBadge


class Specialty(Base):
    """Core Specialty — Section 2.2 / Technology Hub Section 9.2. 5 entries expected."""
    __tablename__ = "specialties"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200))
    short_description: Mapped[str] = mapped_column(Text)
    long_description: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[StatusBadge | None] = mapped_column(
        SAEnum(StatusBadge, values_callable=lambda enum_cls: [member.value for member in enum_cls]),
        nullable=True,
    )
    # JSON-encoded list[str] — short capability bullets shown on the hub + detail pages.
    capabilities: Mapped[str | None] = mapped_column(Text, nullable=True)
    # JSON-encoded list[str] — related platform names shown on the detail page.
    related_products: Mapped[str | None] = mapped_column(Text, nullable=True)
    mission_tag: Mapped[str | None] = mapped_column(String(200), nullable=True)
