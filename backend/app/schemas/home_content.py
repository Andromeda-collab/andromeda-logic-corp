from pydantic import BaseModel, ConfigDict


class HomeContentBase(BaseModel):
    mission_label: str
    mission_title: str
    mission_description: str
    image_url: str | None = None


class HomeContentOut(HomeContentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
