from pydantic import BaseModel, ConfigDict
from datetime import date


class LibraryResourceBase(BaseModel):
    slug: str
    title: str
    asset_type: str  # whitepaper | spec_sheet | briefing | case_study
    specialty_tag: str | None = None
    persona_tag: str | None = None
    is_gated: bool = True
    file_url: str | None = None
    published_date: date


class LibraryResourceCreate(LibraryResourceBase):
    pass


class LibraryResourceOut(LibraryResourceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)