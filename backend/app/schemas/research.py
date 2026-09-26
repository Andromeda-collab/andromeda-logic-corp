from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime


class ResearchContentBase(BaseModel):
    overview: str
    partnership_program: str | None = None


class ResearchContentOut(ResearchContentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class AccessRequestCreate(BaseModel):
    name: str
    institution: str
    email: EmailStr
    research_area: str | None = None
    message: str | None = None


class AccessRequestOut(AccessRequestCreate):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)