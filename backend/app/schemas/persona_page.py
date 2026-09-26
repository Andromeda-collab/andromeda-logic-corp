from pydantic import BaseModel, ConfigDict
from app.models.shared import Persona


class PersonaPageBase(BaseModel):
    slug: Persona
    name: str
    narrative: str
    engagement_paths: str | None = None
    image_url: str | None = None


class PersonaPageCreate(PersonaPageBase):
    pass


class PersonaPageOut(PersonaPageBase):
    id: int
    model_config = ConfigDict(from_attributes=True)