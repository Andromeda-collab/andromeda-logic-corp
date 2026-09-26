from sqlalchemy.orm import Session
from app.models.mission_consultation import MissionConsultation
from app.schemas.mission_consultation import MissionConsultationCreate


def create_mission_consultation(
    db: Session, data: MissionConsultationCreate
) -> MissionConsultation:
    record = MissionConsultation(**data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_all_mission_consultations(db: Session) -> list[MissionConsultation]:
    return db.query(MissionConsultation).order_by(MissionConsultation.created_at.desc()).all()


def get_mission_consultation(db: Session, consultation_id: int) -> MissionConsultation | None:
    return db.get(MissionConsultation, consultation_id)