from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from MySQLdb.cursors import DictCursor


SQLALCHEMY_DATABASE_URL = "mysql://wilton:123456@localhost/retaily_db"

# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
# )
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine,)

Base = declarative_base()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        print('Init db connection ....')
        yield db
    finally:
        print('Closing db connection ....')
        db.close()


def get_cursor(db: Session):
    conn = db.bind.raw_connection()
    cur = conn.cursor(DictCursor)
    return cur