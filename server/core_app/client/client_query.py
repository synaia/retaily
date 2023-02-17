from sqlalchemy.orm import Session
import server.core_app.client.client_models as models


def read_clients(db: Session):
    return db.query(models.Client).all()
