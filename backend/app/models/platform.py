from sqlalchemy import String, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from app.models.shared import StatusBadge


class Platform(Base):
    """Named Product/Platform — Section 9.3. 5 entries expected."""
    __tablename__ = "platforms"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200))
    one_line_pitch: Mapped[str] = mapped_column(String(300))
    status: Mapped[StatusBadge] = mapped_column(SAEnum(StatusBadge, values_callable=lambda enum_cls: [member.value for member in enum_cls]))
    capability_blocks: Mapped[str] = mapped_column(Text, nullable=True)  # JSON-encoded list[str] of features
    spec_sheet_url: Mapped[str] = mapped_column(String(500), nullable=True)
    is_export_controlled: Mapped[bool] = mapped_column(default=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    # Short free-text technical spec line shown on the platform detail page.
    spec_summary: Mapped[str] = mapped_column(Text, nullable=True)
