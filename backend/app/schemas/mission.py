from pydantic import BaseModel, ConfigDict


class MissionBase(BaseModel):
    slug: str
    title: str
    summary: str
    challenge: str | None = None
    approach: str | None = None
    technology_used: str | None = None
    outcome: str | None = None
    reference_rights_approved: bool = False
    image_url: str | None = None


class MissionCreate(MissionBase):
    pass


class MissionOut(MissionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)