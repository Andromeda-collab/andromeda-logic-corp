from sqlalchemy.orm import Session
from app.models.press import PressItem
from app.schemas.press import PressItemCreate


def get_all_press_items(db: Session, year: int | None = None) -> list[PressItem]:
    query = db.query(PressItem).order_by(PressItem.published_date.desc())
    if year:
        query = query.filter(PressItem.published_date.between(f"{year}-01-01", f"{year}-12-31"))
    return query.all()


def get_press_item_by_slug(db: Session, slug: str) -> PressItem | None:
    return db.query(PressItem).filter(PressItem.slug == slug).first()


def create_press_item(db: Session, data: PressItemCreate) -> PressItem:
    item = PressItem(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_press_item(db: Session, item: PressItem, data: PressItemCreate) -> PressItem:
    for field, value in data.model_dump().items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_press_item(db: Session, item: PressItem) -> None:
    db.delete(item)
    db.commit()