from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class TrustContent(Base):
    """Trust, Compliance & Export Control Center — Section 9.14. Single-row table."""
    __tablename__ = "trust_content"

    id: Mapped[int] = mapped_column(primary_key=True)
    export_control_posture: Mapped[str] = mapped_column(Text)
    gated_content_policy: Mapped[str] = mapped_column(Text)
    data_privacy_practices: Mapped[str] = mapped_column(Text)
    responsible_disclosure_email: Mapped[str] = mapped_column(Text)
    certifications: Mapped[str] = mapped_column(Text, nullable=True)  # JSON-encoded list