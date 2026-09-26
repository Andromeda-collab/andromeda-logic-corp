from pydantic import BaseModel, ConfigDict
from app.models.shared import StatusBadge


class PlatformBase(BaseModel):
    slug: str
    name: str
    one_line_pitch: str
    status: StatusBadge
    capability_blocks: str | None = None
    spec_sheet_url: str | None = None
    is_export_controlled: bool = True
    image_url: str | None = None
    spec_summary: str | None = None


class PlatformCreate(PlatformBase):
    pass


class PlatformOut(PlatformBase):
    id: int
    model_config = ConfigDict(from_attributes=True)