from pydantic import BaseModel, ConfigDict
from app.models.shared import StatusBadge


class SpecialtyBase(BaseModel):
    slug: str
    name: str
    short_description: str
    long_description: str | None = None
    status: StatusBadge | None = None
    capabilities: str | None = None
    related_products: str | None = None
    mission_tag: str | None = None


class SpecialtyCreate(SpecialtyBase):
    """Used for POST requests — no id, since the DB assigns it."""
    pass


class SpecialtyOut(SpecialtyBase):
    id: int
    model_config = ConfigDict(from_attributes=True)