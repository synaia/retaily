from pydantic import BaseModel, root_validator
from datetime import datetime
import typing
import warnings

from server.core_app.basemodeler.BaseModelExt import BaseModelExt


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
    product_id: int | None = None
    pricing_id: int | None = None

    class Config:
        orm_mode = True


class Store(BaseModel):
    id: int | None = None
    name: str | None = None
    date_create: datetime | None = None

    class Config:
        orm_mode = True


class Inventory(BaseModel):
    id: int | None = None
    prev_quantity: int | None = None
    quantity: int | None = None
    next_quantity: int | None = None
    last_update: datetime | None = None
    user_updated: str | None = None
    quantity_for_sale: int | None = None
    status: str | None = None
    store: Store | None = None

    class Config:
        orm_mode = True


class InventoryHead(BaseModelExt):
    id: int | None = None
    name: str | None = None
    date_create: datetime | None = None
    date_close: datetime | None = None
    status: int | None = None
    memo: str | None = None
    store: Store | None = None

    class Config:
        orm_mode = True


class Product(BaseModel):
    id: int | None = None
    name: str | None = None
    cost: float | None = None
    price: float | None = None
    price_for_sale: float | None = None
    margin: float | None = None
    code: str | None = None
    img_path: str | None = None
    date_create: datetime | None = None
    active: int | None = None
    image_raw: str | None = None
    is_selected: int | None = None
    user_modified: str | None = None
    inventory: list[Inventory] = []
    pricinglist: list[PricingList] = []

    class Config:
        orm_mode = True


class ProductOrderLine(BaseModelExt):
    id: int | None = None
    product_id: int | None = None
    from_store: Store | None = None
    to_store: Store | None = None
    product_order_id: int | None = None  # Optional?
    quantity: int | None = None
    quantity_observed: int | None = None
    user_receiver: str | None = None
    receiver_memo: str | None = None
    status: str | None = None
    date_create: datetime | None = None
    receiver_last_update: datetime | None = None
    product: Product | None = None

    class Config:
        orm_mode = True


class ProductOrder(BaseModelExt):
    id: int | None = None
    name: str | None = None
    memo: str | None = None
    order_type: str | None = None
    user_requester: str | None = None
    user_receiver: str | None = None
    date_opened: datetime | None = None
    date_closed: datetime | None = None
    product_order_line: list[ProductOrderLine] = []

    class Config:
        orm_mode = True
