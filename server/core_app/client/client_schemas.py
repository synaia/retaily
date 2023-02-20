from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class Client(BaseModel):
    id: int | None = None
    name: str | None = None
    document_id: str | None = None
    address: str | None = None
    celphone: str | None = None
    email: str | None = None
    date_create: datetime | None = None
    wholesaler: bool | None = None

    class Config:
        orm_mode = True
