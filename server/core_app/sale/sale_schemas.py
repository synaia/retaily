from pydantic import BaseModel, root_validator
from datetime import datetime
import typing
import warnings

import server.core_app.client.client_schemas as client
import server.core_app.product.product_schemas as product


class SalePaid(BaseModel):
    id: int
    amount: float
    type: str
    date_create: datetime

    class Config:
        orm_mode = True


class SaleLine(BaseModel):
    id: int | None = None
    amount: float | None = None
    tax_amount: float | None = None
    discount: float | None = None
    quantity: int | None = None
    total_amount: float | None = None
    sale_id: int | None = None
    product_id: int | None = None
    product: product.Product

    class Config:
        orm_mode = True


class Sale(BaseModel):
    id: int
    amount: float
    sub: float
    discount: float
    tax_amount: float
    delivery_charge: float | None = None
    sequence: str | None = None
    sequence_type: str | None = None
    status: str | None = None
    sale_type: str | None = None
    date_create: datetime | None = None
    login: str | None = None
    sale_line: list[SaleLine] = []
    sale_paid: list[SalePaid] = []
    client: client.Client

    class Config:
        orm_mode = True