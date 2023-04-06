import os
import sys

from fastapi import APIRouter, Depends, HTTPException, Security, Header, status
from fastapi import UploadFile, Response, WebSocket, WebSocketDisconnect
from aiocache import Cache
from server.core_app.ext.remove_bg import remove_it
from typing import Optional
from sqlalchemy.orm import Session
from aiocache import Cache
import asyncio

from server.core_app.database import get_db
from server.core_app.product.product_query import read_products, read_all_products, read_pricing_labels,  update_one, add_pricing, read_pricing, update_pricing, add_product, read_stores
import server.core_app.product.product_schemas as schemas
import server.core_app.user.user_models as models
from server.core_app.user.user_query import validate_permissions
from server.core_app.dbfs.Query import Query
from server.core_app.websocket.connectionmanager import ConnectionManager, send_periodically


router = APIRouter(prefix='/products', tags=['products'])
myvar = Cache(Cache.MEMORY)

gettrace = getattr(sys, 'gettrace', None)
# is debug mode :-) ?
if gettrace():
    path = os.getcwd() + '/dbfs/query.sql'
    print('Debugging :-* ')
else:
    path = os.getcwd() + '/server/core_app/dbfs/query.sql'
    print('Run normally.')

query = Query(path)


@router.on_event("startup")
async def startup_event():
    print('Router: Init startup_event....')
    # query = get_query()
    await myvar.set('sharable', {'image_base64': None})
    await myvar.set('sharable_per_client', list())
    await myvar.set('client_uuid_list', list())
    print()


@router.get("/", response_model=list[schemas.Product])
async def get_products(
        db: Session = Depends(get_db),
        store: Optional[str] = Header(None),
        user_active: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    products = read_products(store, db, query)
    return products


@router.get("/all", response_model=list[schemas.Product])
async def get_products(
        db: Session = Depends(get_db),
        store: Optional[str] = Header(None),
        user_active: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    products = read_all_products(db, query)
    return products


@router.get("/pricing_labels", response_model=list[schemas.Pricing])
async def get_pricing_labels(
        db: Session = Depends(get_db),
        store: Optional[str] = Header(None),
        user_active: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    pricings = read_pricing_labels(db, query)
    return pricings


@router.post("/update")
async def update_product(
                        pricing_id: int,
                        product_id: int,
                        field: str,
                        value: str,
                        db: Session = Depends(get_db)):
    try:
        update_one(pricing_id, field, value, product_id, db)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.get("/pricing", response_model=list[schemas.Pricing])
async def get_pricing(
        db: Session = Depends(get_db),
        store: Optional[str] = Header(None),
        user_active: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    pricings = read_pricing(db, query)
    return pricings


@router.get("/stores", response_model=list[schemas.Store])
async def get_pricing(
        db: Session = Depends(get_db),
        user_active: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    stores = read_stores(db, query)
    return stores


@router.post("/add_pricing", response_model=list[schemas.Pricing])
async def __add_pricing(
                        price: schemas.Pricing,
                        percent: float,
                        db: Session = Depends(get_db)):
    try:
        return add_pricing(price, percent, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/update_pricing", response_model=list[schemas.Pricing])
async def __update_pricing(
                        price_id: int,
                        field: str,
                        value: str,
                        db: Session = Depends(get_db)):
    try:
        return update_pricing(price_id, field, value, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/add_product", response_model=list[schemas.Product])
async def __add_product(
                        product: schemas.Product,
                        db: Session = Depends(get_db)):
    try:
        return add_product(product, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/uploadfilelocal/{client_uuid}",)
async def uploadfilelocal(file: UploadFile, client_uuid: str):
    print("client_uuid", client_uuid)
    image_base64 = remove_it(file.file._file, client_uuid)
    return image_base64


@router.post("/uploadfile/{client_uuid}",)
async def upload_file(file: UploadFile, client_uuid: str):
    client_uuid_list = await myvar.get('client_uuid_list')
    if client_uuid not in client_uuid_list:
        return {"message": f"UUID {client_uuid} is not a valid client.", "code": "fail"}

    print("filename", file.filename)
    image_base64 = remove_it(file.file._file, client_uuid)

    sharable = {'image_base64': image_base64}
    await myvar.set('sharable', sharable)
    sharable_per_client = await myvar.get('sharable_per_client')
    for id in client_uuid_list:
        if id == client_uuid:
            sharable_per_client.append({'client_uuid': id, 'sharable': sharable})
            await myvar.set('sharable_per_client', sharable_per_client)

    return {"message": f"UUID {client_uuid} nice.", "code": "success"}


@router.websocket("/ws/{client_uuid}")
async def websocket_endpoint(websocket: WebSocket, client_uuid: str):
    manager = ConnectionManager()
    await manager.connect(websocket, client_uuid, myvar=myvar)
    await websocket.send_json({'Welcome nigga':  client_uuid})
    print('Wating for new events [send_periodically] ....')
    await asyncio.create_task(send_periodically(websocket, manager, client_uuid, 0.9, myvar=myvar))

