from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class NavItem(Base):
    """Header navigation link — Section 8.1 (Global Modules / Header).
    Drives the public Header nav links + the primary CTA button so their
    text/target can be edited from the Admin Portal instead of being
    hardcoded in the frontend. Ordered by id (insertion order)."""
    __tablename__ = "nav_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[str] = mapped_column(String(100))
    url: Mapped[str] = mapped_column(String(300))
    # True for the single primary CTA button ("Request Mission Consultation"),
    # False for the regular nav links.
    is_cta: Mapped[bool] = mapped_column(Boolean, default=False)
