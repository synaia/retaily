from sqlalchemy.orm import Session
import server.core_app.client.client_models as models
from server.core_app.dbfs.Query import Query
from server.core_app.database import get_cursor
# scrap
# https://dgii.gov.do/app/WebApps/ConsultasWeb/consultas/ciudadanos.aspx


def read_clients(db: Session):
    return db.query(models.Client).order_by(models.Client.date_create.desc()).all()


def create_client(client: models.Client, db: Session, query: Query):
    sql_raw_insert_client = query.INSERT_CLIENT
    cur = get_cursor(db)
    try:
        data = (str(client.name).upper(), client.document_id, client.address, client.celphone, client.email, client.wholesaler)
    except Exception as ex:
        data = (client.name, client.document_id, client.address, client.celphone, client.email, client.wholesaler)
    cur.execute(sql_raw_insert_client, data)
    cur.connection.commit()

    # db.add(client)
    # db.commit()
    # db.refresh(client)
    return client


def update_client(client_id: int, field: str, value: str, db: Session):
    cur = get_cursor(db)
    sql_raw_update = f'UPDATE client SET {field} = "{value}" WHERE id = %s;'
    cur.execute(sql_raw_update, (client_id,))
    cur.connection.commit()

