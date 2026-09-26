from pydantic import BaseModel, ConfigDict


class AboutContentBase(BaseModel):
    mission_statement: str
    vision_statement: str
    leadership: str | None = None
    heritage_timeline: str | None = None
    locations: str | None = None


class AboutContentCreate(AboutContentBase):
    pass


class AboutContentOut(AboutContentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)