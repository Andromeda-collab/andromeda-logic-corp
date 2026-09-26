from pydantic import BaseModel, ConfigDict


class TrustContentBase(BaseModel):
    export_control_posture: str
    gated_content_policy: str
    data_privacy_practices: str
    responsible_disclosure_email: str
    certifications: str | None = None


class TrustContentOut(TrustContentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)