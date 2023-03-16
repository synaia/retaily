from pydantic import BaseModel, root_validator
from datetime import datetime
import typing
import warnings


class Store(BaseModel):
    name: str
    date_create: datetime | None = None

    class Config:
        orm_mode = True


class Inventory(BaseModel):
    quantity: int | None = None
    quantity_for_sale: int | None = None
    store: Store

    class Config:
        orm_mode = True


class Product(BaseModel):
    id: int
    name: str | None = None
    cost: float
    price: float
    # quantity: int
    # quantity_for_sale: int
    price_for_sale: float
    margin: float | None = None
    code: str | None = None
    img_path: str | None = None
    date_create: datetime | None = None
    active: int
    image_raw: str | None = None
    is_selected: int
    inventory: Inventory

    class Config:
        orm_mode = True
