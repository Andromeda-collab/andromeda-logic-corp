from pydantic import BaseModel, ConfigDict
from datetime import date


class PressItemBase(BaseModel):
    slug: str
    title: str
    body: str | None = None
    is_external: bool = False
    source_outlet: str | None = None
    published_date: date


class PressItemCreate(PressItemBase):
    pass


class PressItemOut(PressItemBase):
    id: int
    model_config = ConfigDict(from_attributes=True)