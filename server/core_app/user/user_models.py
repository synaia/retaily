from sqlalchemy import MetaData, Column,  Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from server.core_app.database import Base, engine


meta = MetaData()


app_user_store = Table(
    "app_user_store",
    Base.metadata,
    Column("user_id", ForeignKey("app_users.id"), primary_key=True),
    Column("store_id", ForeignKey("app_store.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "app_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(20), unique=True, index=True)
    password = Column(String(200), unique=False, index=False)
    first_name = Column(String(20), unique=False, index=False)
    last_name = Column(String(30), unique=False, index=False)
    is_active = Column(Integer)
    date_joined = Column(DateTime)
    last_login = Column(DateTime)
    scope = relationship("Scope", back_populates='owner')

    store = relationship("Store", back_populates='user', secondary=app_user_store)


class Scope(Base):
    __tablename__ = "scopes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(20), unique=False, index=False)
    user_id = Column(Integer, ForeignKey('app_users.id'))
    owner = relationship('User', back_populates='scope')



# import logging
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)


# Scope.__table__.drop(engine)
# User.__table__.drop(engine)


# User.__table__.create(engine)
# UserStore.__table__.create(engine)
