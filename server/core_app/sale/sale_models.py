from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property

from server.core_app.database import Base
from server.core_app.user.user_models import app_user_store
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property

from server.core_app.database import Base


class Sale(Base):
    __tablename__ = "sale"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    sub = Column(Float)
    discount = Column(Float)
    tax_amount = Column(Float)
    delivery_charge = Column(Float)
    sequence = Column(String(30))
    sequence_type = Column(String(45))
    status = Column(String)
    sale_type = Column(String(45))
    date_create = Column(DateTime)
    login = Column(String(45))
    store_id = Column(Integer, ForeignKey('app_store.id'))
    client_id = Column(Integer, ForeignKey('client.id'))
    client = relationship("Client", backref='sale', uselist=False)
    store = relationship("Store", backref='sale', uselist=False)
    sale_line = relationship("SaleLine", backref='sale', uselist=True)
    sale_paid = relationship("SalePaid", backref='sale', uselist=True)


class SaleLine(Base):
    __tablename__ = "sale_line"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    tax_amount = Column(Float)
    discount = Column(Float)
    quantity = Column(Integer)
    total_amount = Column(Float)
    sale_id = Column(Integer, ForeignKey('sale.id'))
    product_id = Column(Integer, ForeignKey('product.id'))
    product = relationship("Product", backref='sale_line', uselist=False)


class SalePaid(Base):
    __tablename__ = "sale_paid"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    type = Column(String)
    date_create = Column(DateTime)
    sale_id = Column(Integer, ForeignKey('sale.id'))
