from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property

from server.core_app.database import Base
from server.core_app.user.user_models import app_user_store


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
    user_modified = Column(String)
    inventory = relationship("Inventory", backref='product', uselist=True)
    pricinglist = relationship("PricingList", backref='product', uselist=True)

    # inventory = relationship("Inventory", back_populates="product")

    @hybrid_property
    def price_for_sale(self):
        return self.price

    @hybrid_property
    def is_selected(self):
        return 0


class Inventory(Base):
    __tablename__ = "app_inventory"

    id = Column(Integer, primary_key=True, index=True)
    prev_quantity = Column(Integer)
    quantity = Column(Integer)
    next_quantity = Column(Integer)
    last_update = Column(DateTime)
    user_updated = Column(String)
    status = Column(String)
    product_id = Column(Integer, ForeignKey('product.id'))
    store_id = Column(Integer, ForeignKey('app_store.id'))
    store = relationship("Store", backref='inventory', uselist=False)

    # product = relationship("Product", back_populates="inventory")
    #
    # store = relationship("Store",  back_populates="inventory")


    @hybrid_property
    def quantity_for_sale(self):
        return 1


class InventoryHead(Base):
    __tablename__ = "app_inventory_head"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    date_create = Column(DateTime)
    date_close  = Column(DateTime)
    status = Column(Integer)
    memo = Column(String)
    store_id = Column(Integer, ForeignKey('app_store.id'))
    store = relationship("Store", backref='inventory_head', uselist=False)


class Store(Base):
    __tablename__ = "app_store"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    date_create = Column(DateTime)
    # inventory = relationship("Inventory", back_populates='store_owner')

    # inventory = relationship("Inventory", back_populates="store")

    user = relationship("User", back_populates='stores', secondary=app_user_store)


class Pricing(Base):
    __tablename__ = "pricing"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String, unique=True, index=True)
    price_key = Column(String, unique=True, index=True)
    user_modified = Column(String)
    date_create = Column(DateTime)
    status = Column(Integer)


class PricingList(Base):
    __tablename__ = "pricing_list"

    id = Column(Integer, primary_key=True, index=True)
    price = Column(Float)
    user_modified = Column(String)
    date_create = Column(DateTime)
    product_id = Column(Integer, ForeignKey('product.id'))
    pricing_id = Column(Integer, ForeignKey('pricing.id'))
    pricing = relationship("Pricing", backref='pricing_list', uselist=False)


class ProductOrder(Base):
    __tablename__ = "product_order"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    memo = Column(String)
    order_type = Column(String)
    user_requester = Column(String)
    user_receiver = Column(String)
    date_opened = Column(DateTime)
    date_closed = Column(DateTime)


class ProductOrderLine(Base):
    __tablename__ = "product_order_line"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('product.id'))
    from_store_id = Column(Integer, ForeignKey('app_store.id'))
    to_store_id = Column(Integer, ForeignKey('app_store.id'))
    product_order_id = Column(Integer, ForeignKey('product_order.id'))
    quantity = Column(Integer)
    status = Column(String)
    date_create = Column(DateTime)


# from core_app.database import engine
# Inventory.__table__.create(engine)
