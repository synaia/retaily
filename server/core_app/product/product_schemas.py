from pydantic import BaseModel, root_validator
from datetime import datetime
import typing
import warnings


class Pricing(BaseModel):
    id: int | None = None
    label: str
    price_key: str | None= None
    user_modified: str | None = None
    date_create: datetime | None = None
    status: int | None = None

    class Config:
        orm_mode = True


class PricingList(BaseModel):
    price: float
    user_modified: str | None = None
    date_create: datetime | None = None
    pricing: Pricing | None = None

    class Config:
        orm_mode = True


class Inventory(BaseModel):
    quantity: int | None = None
    quantity_for_sale: int | None = None

    class Config:
        orm_mode = True


class Store(BaseModel):
    name: str
    date_create: datetime | None = None
    inventory: Inventory | None = None

    class Config:
        orm_mode = True


class Product(BaseModel):
    id: int
    name: str | None = None
    cost: float
    price: float
    price_for_sale: float | None = None
    margin: float | None = None
    code: str | None = None
    img_path: str | None = None
    date_create: datetime | None = None
    active: int | None = None
    image_raw: str | None = None
    is_selected: int | None = None
    user_modified: str | None= None
    stores: list[Store] = []
    pricinglist: list[PricingList] = []

    class Config:
        orm_mode = True
