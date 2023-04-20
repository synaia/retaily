from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from server.core_app.basemodeler.BaseModelExt import BaseModelExt


class Provider(BaseModelExt):
    id: int | None = None
    name: str | None = None
    date_create: datetime | None = None

    class Config:
        orm_mode = True
