from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property

from core_app.database import Base
from core_app.user.user_models import app_user_store


class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=False, index=False)
    cost = Column(Float)
    price = Column(Float)
    margin = Column(Float)
    code = Column(String)
    img_path = Column(String)
    date_create = Column(String)
    active = Column(Integer)
    image_raw = Column(String)
    inventory = relationship("Inventory", backref='product', uselist=False)

    # inventory = relationship("Inventory", back_populates="product")

    @hybrid_property
    def price_for_sale(self):
        return self.price


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
