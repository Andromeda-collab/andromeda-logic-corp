from pydantic import BaseModel, ConfigDict


class JobRequisitionBase(BaseModel):
    slug: str
    title: str
    discipline: str
    location: str | None = None
    requires_clearance: bool = False
    description: str | None = None
    is_open: bool = True


class JobRequisitionCreate(JobRequisitionBase):
    pass


class JobRequisitionOut(JobRequisitionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)