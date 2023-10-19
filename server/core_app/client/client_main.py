import os
import sys
from fastapi import APIRouter, Depends, HTTPException, Security, status
from sqlalchemy.orm import Session
from server.core_app.database import get_db
from server.core_app.user.user_query import validate_permissions
import server.core_app.client.client_schemas as schemas
import server.core_app.user.user_models as models
import server.core_app.client.client_models as client_models
from server.core_app.client.client_query import read_clients, create_client, update_client
from server.core_app.dbfs.Query import Query


router = APIRouter(prefix='/clients', tags=['clients'])

gettrace = getattr(sys, 'gettrace', None)
# is debug mode :-) ?
if gettrace():
    path = os.getcwd() + '/dbfs/query.sql'
    print('Debugging :-* ')
else:
    path = os.getcwd() + '/server/core_app/dbfs/query.sql'
    print('Run normally.')

query = Query(path)


@router.get("/", response_model=list[schemas.Client])
async def get_clients(
        db: Session = Depends(get_db),
        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    products = read_clients(db)
    return products


@router.post("/add", response_model=schemas.Client)
async def add_client(
        client: schemas.Client,
        db: Session = Depends(get_db),
        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    new_client = client_models.Client(**{
        "name": client.name,
        "document_id": client.document_id,
        "address": client.address,
        "celphone": client.celphone,
        "email": client.email,
        "wholesaler": client.wholesaler,
    })

    try:
        return create_client(new_client, db=db, query=query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.put("/update/{client_id}")
async def upt_client(
        client_id: int,
        client: schemas.Client,
        db: Session = Depends(get_db),
        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    new_client = client_models.Client(**{
        "id": client_id,
        "name": client.name,
        "document_id": client.document_id,
        "address": client.address,
        "celphone": client.celphone,
        "email": client.email,
        "date_create": client.date_create,
        "wholesaler": True
    })

    try:
        return update_client(client, db=db)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))
