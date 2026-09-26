from pydantic import BaseModel, ConfigDict


class NavItemBase(BaseModel):
    label: str
    url: str
    is_cta: bool = False


class NavItemCreate(NavItemBase):
    """Used for POST/PUT requests — no id, since the DB assigns it."""
    pass


class NavItemOut(NavItemBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
