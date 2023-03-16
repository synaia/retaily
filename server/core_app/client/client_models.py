from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property

from server.core_app.database import Base


class Client(Base):
    __tablename__ = "client"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=False, index=False)
    document_id = Column(String)
    address = Column(String)
    celphone = Column(String)
    email = Column(String)
    date_create = Column(DateTime)
    wholesaler = Column(Integer)