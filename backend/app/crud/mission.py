from sqlalchemy.orm import Session
from app.models.mission import Mission
from app.schemas.mission import MissionCreate


def get_all_missions(db: Session) -> list[Mission]:
    # Editorial Gate — Section 9.6: only reference-rights-approved missions
    # are ever publicly listed, regardless of what else is in the table.
    return db.query(Mission).filter(Mission.reference_rights_approved == True).all()  # noqa: E712


def get_mission_by_slug(db: Session, slug: str) -> Mission | None:
    return (
        db.query(Mission)
        .filter(Mission.slug == slug, Mission.reference_rights_approved == True)  # noqa: E712
        .first()
    )


def create_mission(db: Session, data: MissionCreate) -> Mission:
    mission = Mission(**data.model_dump())
    db.add(mission)
    db.commit()
    db.refresh(mission)
    return mission


# Admin-facing lookups bypass the reference-rights publication gate so drafts
# can be viewed/edited before they're approved for public listing.
def get_all_missions_admin(db: Session) -> list[Mission]:
    return db.query(Mission).all()


def get_mission_by_slug_admin(db: Session, slug: str) -> Mission | None:
    return db.query(Mission).filter(Mission.slug == slug).first()


def update_mission(db: Session, mission: Mission, data: MissionCreate) -> Mission:
    for field, value in data.model_dump().items():
        setattr(mission, field, value)
    db.commit()
    db.refresh(mission)
    return mission


def delete_mission(db: Session, mission: Mission) -> None:
    db.delete(mission)
    db.commit()