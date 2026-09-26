from pydantic import BaseModel, ConfigDict


class InvestorsContentBase(BaseModel):
    company_snapshot: str
    partner_program: str
    disclosures: str | None = None


class InvestorsContentOut(InvestorsContentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)