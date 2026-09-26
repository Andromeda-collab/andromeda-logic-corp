from sqlalchemy import String, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from app.models.shared import Persona as PersonaEnum


class PersonaPage(Base):
    """Solutions-by-Audience entry — Section 9.4. 4 entries expected."""
    __tablename__ = "persona_pages"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[PersonaEnum] = mapped_column(SAEnum(PersonaEnum, values_callable=lambda enum_cls: [member.value for member in enum_cls]),unique=True,)
    name: Mapped[str] = mapped_column(String(200))
    narrative: Mapped[str] = mapped_column(Text)
    engagement_paths: Mapped[str] = mapped_column(Text, nullable=True)  # JSON-encoded
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
