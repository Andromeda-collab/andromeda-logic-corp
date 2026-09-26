from sqlalchemy.orm import Session
from app.models.library_resource import LibraryResource
from app.schemas.library_resource import LibraryResourceCreate


def get_all_resources(db: Session, specialty: str | None = None, persona: str | None = None,
                       asset_type: str | None = None) -> list[LibraryResource]:
    query = db.query(LibraryResource).order_by(LibraryResource.published_date.desc())
    if specialty:
        query = query.filter(LibraryResource.specialty_tag == specialty)
    if persona:
        query = query.filter(LibraryResource.persona_tag == persona)
    if asset_type:
        query = query.filter(LibraryResource.asset_type == asset_type)
    return query.all()


def get_resource_by_slug(db: Session, slug: str) -> LibraryResource | None:
    return db.query(LibraryResource).filter(LibraryResource.slug == slug).first()


def create_resource(db: Session, data: LibraryResourceCreate) -> LibraryResource:
    resource = LibraryResource(**data.model_dump())
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource


def update_resource(db: Session, resource: LibraryResource, data: LibraryResourceCreate) -> LibraryResource:
    for field, value in data.model_dump().items():
        setattr(resource, field, value)
    db.commit()
    db.refresh(resource)
    return resource


def delete_resource(db: Session, resource: LibraryResource) -> None:
    db.delete(resource)
    db.commit()