from sqlalchemy.orm import Session
from app.models.platform import Platform
from app.schemas.platform import PlatformCreate


def get_all_platforms(db: Session) -> list[Platform]:
    return db.query(Platform).all()


def get_platform_by_slug(db: Session, slug: str) -> Platform | None:
    return db.query(Platform).filter(Platform.slug == slug).first()


def create_platform(db: Session, data: PlatformCreate) -> Platform:
    platform = Platform(**data.model_dump())
    db.add(platform)
    db.commit()
    db.refresh(platform)
    return platform


def update_platform(db: Session, platform: Platform, data: PlatformCreate) -> Platform:
    for field, value in data.model_dump().items():
        setattr(platform, field, value)
    db.commit()
    db.refresh(platform)
    return platform


def delete_platform(db: Session, platform: Platform) -> None:
    db.delete(platform)
    db.commit()