from pydantic import BaseModel, root_validator
from datetime import datetime
import typing
from core_app.product.product_schemas import Store


class Scope(BaseModel):
    name: str | None = None

    class Config:
        orm_mode = True


class User(BaseModel):
    # id: int
    username: str | None = None
    password: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    is_active: bool | None = None
    date_joined: datetime | None = None
    last_login: datetime | None = None
    scope: list[Scope] = []
    store: list[Store] = []

    class Config:
        orm_mode = True
