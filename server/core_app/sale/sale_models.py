from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property

from server.core_app.database import Base
from server.core_app.user.user_models import app_user_store


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
    store = Column(String(45)) # new to [add]
    # employee [removed]
    client_id = Column(Integer, ForeignKey('client.id'))
    client = relationship("Client", backref='sale', uselist=False)





class Inventory(Base):
    __tablename__ = "app_inventory"

    id = Column(Integer, primary_key=True, index=True)
    quantity = Column(Integer)
    product_id = Column(Integer, ForeignKey('product.id'))
    store_id = Column(Integer, ForeignKey('app_store.id'))
    store = relationship("Store", backref='inventory', uselist=False)

    # product = relationship("Product", back_populates="inventory")
    #
    # store = relationship("Store",  back_populates="inventory")


    @hybrid_property
    def quantity_for_sale(self):
        return 1


class Store(Base):
    __tablename__ = "app_store"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    date_create = Column(DateTime)
    # inventory = relationship("Inventory", back_populates='store_owner')

    # inventory = relationship("Inventory", back_populates="store")

    user = relationship("User", back_populates='store', secondary=app_user_store)




# from core_app.database import engine
# Inventory.__table__.create(engine)
