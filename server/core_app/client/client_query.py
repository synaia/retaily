from sqlalchemy.orm import Session
import server.core_app.client.client_models as models


def read_clients(db: Session):
    return db.query(models.Client).order_by(models.Client.date_create.desc()).all()
