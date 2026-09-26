from sqlalchemy.orm import Session
from app.models.nav_item import NavItem
from app.schemas.nav_item import NavItemCreate


def get_all_nav_items(db: Session) -> list[NavItem]:
    return db.query(NavItem).order_by(NavItem.id).all()


def get_nav_item(db: Session, nav_item_id: int) -> NavItem | None:
    return db.get(NavItem, nav_item_id)


def create_nav_item(db: Session, data: NavItemCreate) -> NavItem:
    nav_item = NavItem(**data.model_dump())
    db.add(nav_item)
    db.commit()
    db.refresh(nav_item)
    return nav_item


def update_nav_item(db: Session, nav_item: NavItem, data: NavItemCreate) -> NavItem:
    for field, value in data.model_dump().items():
        setattr(nav_item, field, value)
    db.commit()
    db.refresh(nav_item)
    return nav_item


def delete_nav_item(db: Session, nav_item: NavItem) -> None:
    db.delete(nav_item)
    db.commit()
