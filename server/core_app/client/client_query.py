from sqlalchemy.orm import Session
import server.core_app.client.client_models as models

# scrap
# https://dgii.gov.do/app/WebApps/ConsultasWeb/consultas/ciudadanos.aspx


def read_clients(db: Session):
    return db.query(models.Client).order_by(models.Client.date_create.desc()).all()


def create_client(client: models.Client, db: Session):
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


def update_client(client, db: Session):
    obj = db.query(models.Client).where(models.Client.id == client.id)
    obj.update(client.dict())
    db.commit()
