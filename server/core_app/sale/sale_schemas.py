from pydantic import BaseModel, root_validator
from datetime import datetime
import typing
import warnings

import server.core_app.client.client_schemas as client
import server.core_app.product.product_schemas as product


class Sequence(BaseModel):
    id: int | None = None
    name: str | None = None
    code: str | None = None
    prefix: str | None = None
    fill: int | None = None
    increment_by: int | None = None
    current_seq: int | None = None

    class Config:
        orm_mode = True


class SalePaid(BaseModel):
    id: int | None = None
    amount: float | None = None
    type: str | None = None
    date_create: datetime | None = None

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
    additional_info: str | None = None
    total_paid: float | None = None
    due_balance: float | None = None
    invoice_status: str | None = None
    sale_line: list[SaleLine] = []
    sale_paid: list[SalePaid] = []
    client: client.Client

    class Config:
        orm_mode = True
