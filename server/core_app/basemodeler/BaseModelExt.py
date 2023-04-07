from pydantic import BaseModel

SUCCESS = 'success'
FAIL = 'fail'


class MetaInfo(BaseModel):
    count: int | None = None
    code: str | None = None
    message: str | None = None


class BaseModelExt(BaseModel):
    meta:  MetaInfo | None = None

    def build_meta(self, count: int, code: str, message: str):
        self.meta = MetaInfo()
        self.meta.count = count
        self.meta.code = code
        self.meta.message = message

