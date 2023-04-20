from sqlalchemy.orm import Session
from server.core_app.dbfs.Query import Query
from server.core_app.database import get_cursor
from server.core_app.provider.provider_schemas import Provider

# scrap
# https://dgii.gov.do/app/WebApps/ConsultasWeb/consultas/ciudadanos.aspx


def read_providers(db: Session, query: Query):
    sql_raw: str = query.SELECT_PROVIDERS
    list = []
    cur = get_cursor(db)
    cur.execute(sql_raw)
    resp = cur.fetchall()
    for rp in resp:
        provider = Provider()
        provider.id = rp['id']
        provider.name = rp['name']
        list.append(provider)
    return list
