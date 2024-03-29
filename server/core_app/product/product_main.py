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
from server.core_app.product.product_query import (
    read_products,
    read_all_products,
    read_all_inv_products,
    read_pricing_labels,
    update_one,
    add_pricing,
    read_pricing,
    update_pricing,
    add_product,
    read_stores,
    read_inv_products,
    add_new_inventory_head,
    read_inventory_head,
    read_inventory_head_by_store_id,
    update_next_inventory_qty,
    reorder_inventory_qty,
    read_stores_inv,
    add_app_store,
    cancel_inventory_in_progress,
    add_product_order,
    add_product_order_line,
    read_product_order,
    read_product_order_by_id,
    process_order,
    issue_order_line,
    rollback_order,
    assign_order_to_bulk,
    read_bulk_order,
    add_bulk_order,
    approbal_issue_order_line,
    delivery,
    read_sales_total,
    read_store_byid
)
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
        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        products = read_products(store, db, query)
    except Exception as ex:
        print(ex)

    return products


@router.get("/all", response_model=list[schemas.Product])
async def get_products(
        db: Session = Depends(get_db),
        store: Optional[str] = Header(None),
        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        products = read_all_products(token_info, db, query)
    except Exception as ex:
        print(ex)

    return products


# deprecated
@router.get("/all_inv",)
async def get_all_inv_products(
        store_name: str,
        db: Session = Depends(get_db),
        store: Optional[str] = Header(None),
        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        products = read_inv_products(store_name, db, query)
    except Exception as ex:
        print(ex)

    return products


@router.get("/all_inv_new_version/{store_id}",)
async def __all_inv_new_version(
        store_id: int,
        db: Session = Depends(get_db),
        store: Optional[str] = Header(None),
        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        products = read_all_inv_products(store_id, db, query)
        return products
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.get("/pricing_labels", response_model=list[schemas.Pricing])
async def get_pricing_labels(
        db: Session = Depends(get_db),
        store: Optional[str] = Header(None),
        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
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
        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    pricings = read_pricing(db, query)
    return pricings


@router.get("/stores", response_model=list[schemas.Store])
async def get_stores(
        db: Session = Depends(get_db),
        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    stores = read_stores(db, query)
    return stores


@router.get("/stores_inv")
async def get_stores_inv(
        db: Session = Depends(get_db),
        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    stores = read_stores_inv(db, query)
    return stores


@router.post("/add_store")
async def add_store(
                        store_name: str,
                        db: Session = Depends(get_db)):
    try:
        return add_app_store(store_name, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


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
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["product.add"])
):
    try:
        return add_product(product, db, query, token_info)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/open_inventory", response_model=schemas.InventoryHead)
async def open_inventory(
                        head: schemas.InventoryHead,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        return add_new_inventory_head(head, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.get("/inventory_head", response_model=schemas.InventoryHead)
async def get_inventory_head(
                        store_name: str,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        return read_inventory_head(store_name, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.get("/inventory_head_store_id/{store_id}", response_model=schemas.InventoryHead)
async def get_inventory_head(
                        store_id: str,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        return read_inventory_head_by_store_id(store_id, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/update_next_qty",)
async def update_next_qty(
                        next_quantity: int,
                        user_updated: str,
                        product_id: int,
                        store_id: int,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        return update_next_inventory_qty(next_quantity, user_updated,  product_id, store_id, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/close_inventory", response_model=schemas.InventoryHead)
async def close_inventory(
                        store: schemas.Store,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        return reorder_inventory_qty(store, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/cancel_inventory", response_model=schemas.InventoryHead)
async def cancel_inventory(
                        store: schemas.Store,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        return cancel_inventory_in_progress(store, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/add_product_order", response_model=list[schemas.ProductOrder])
async def __add_product_order(
                        order: schemas.ProductOrder,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        result = add_product_order(order, db, query)

        #####
        #  Web Socket Updated
        #####
        if order.order_type == "movement":
            sharable: dict = {
                'origin': 'ORDER_NEW',
                'marker': 'new',
                'body': {
                    'order': {
                        'id': result['product_order_id'],
                        'name': order.name,
                        'memo': order.memo,
                        'status': "new order",
                        'user_receiver': order.user_requester,
                        'issues': []
                    }
                }
            }

            store = read_store_byid(order.to_store.id, db, query)
            await myvar.set('sharable', sharable)
            client_uuid_list = await myvar.get('client_uuid_list')
            sharable_per_client = await myvar.get('sharable_per_client')
            for uniquename in client_uuid_list:
                if uniquename == store.name:
                    sharable_per_client.append({'client_uuid': uniquename, 'sharable': sharable})
                    await myvar.set('sharable_per_client', sharable_per_client)

        return result['orders']
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/add_product_order_line",)
async def __add_product_order_line(
                        line: schemas.ProductOrderLine,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        result = add_product_order_line(line, db, query)

        #####
        #  Web Socket Updated
        #####
        order: schemas.ProductOrder = result['_order']

        sharable: dict = {
            'origin': 'ORDER_PRODUCT_LINE',
            'marker': 'order-line',
            'body': {
                'order': {
                    'id': order.id,
                    'name': order.name,
                    'memo': order.memo,
                    'status': "order line changes",
                    'user_receiver': order.user_receiver,
                    'user_requester': order.user_requester,
                    'issues': []
                }
            }
        }

        store: str = order.to_store.name
        await myvar.set('sharable', sharable)
        client_uuid_list = await myvar.get('client_uuid_list')
        sharable_per_client = await myvar.get('sharable_per_client')
        for uniquename in client_uuid_list:
            if uniquename == store:
                sharable_per_client.append({'client_uuid': uniquename, 'sharable': sharable})
                await myvar.set('sharable_per_client', sharable_per_client)

        return result
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/issue_order_line")
async def __issue_order_line(
                        line: schemas.ProductOrderLine,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        result = issue_order_line(line, db, query)

        #####
        #  Web Socket Updated
        #####
        order: schemas.ProductOrder = result['order']
        issues: [] = []
        for l in order.product_order_line:
            if l.status == "issue":
                ln = {
                    'id': l.product.id,
                    'product_name': l.product.name,
                    'quantity': l.quantity,
                    'quantity_observed': l.quantity_observed
                }
                issues.append(ln)

        sharable: dict = {
            'origin': 'ORDER_ISSUE',
            'marker': 'issue',
            'body': {
                'order': {
                    'id': order.id,
                    'name': order.name,
                    'memo': order.memo,
                    'status': result['status'],
                    'user_receiver': order.user_receiver,
                    'user_requester': order.user_requester,
                    'issues': issues
                }
            }
        }

        store: str = order.from_store.name
        await myvar.set('sharable', sharable)
        client_uuid_list = await myvar.get('client_uuid_list')
        sharable_per_client = await myvar.get('sharable_per_client')
        for uniquename in client_uuid_list:
            if uniquename == store:
                sharable_per_client.append({'client_uuid': uniquename, 'sharable': sharable})
                await myvar.set('sharable_per_client', sharable_per_client)

        return result

    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/approbal_issue")
async def __approbal_issue_order_line(
                        line: schemas.ProductOrderLine,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        result = approbal_issue_order_line(line, db, query)

        #####
        #  Web Socket Updated
        #####
        order: schemas.ProductOrder = result['order']
        issues: [] = []
        for l in order.product_order_line:
            ln = {
                'id': l.product.id,
                'product_name': l.product.name,
                'quantity': l.quantity,
                'quantity_observed': l.quantity_observed
            }
            issues.append(ln)

        sharable: dict = {
            'origin': 'ORDER_APPROBAL',
            'marker': 'approbal',
            'body': {
                'order': {
                    'id': order.id,
                    'name': order.name,
                    'memo': order.memo,
                    'status': "approbal",
                    'user_receiver': order.user_receiver,
                    'user_requester': order.user_requester,
                    'issues': issues
                }
            }
        }

        store: str = order.to_store.name
        await myvar.set('sharable', sharable)
        client_uuid_list = await myvar.get('client_uuid_list')
        sharable_per_client = await myvar.get('sharable_per_client')
        for uniquename in client_uuid_list:
            if uniquename == store:
                sharable_per_client.append({'client_uuid': uniquename, 'sharable': sharable})
                await myvar.set('sharable_per_client', sharable_per_client)

        return result
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.get("/product_order", response_model=list[schemas.ProductOrder])
async def __read_product_order(
                        order_type: str,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        return read_product_order(order_type, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.get("/product_order/{product_order_id}/{order_type}", response_model=schemas.ProductOrder)
async def __read_product_order_by_id(
                        product_order_id: int,
                        order_type: str,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        line = schemas.ProductOrderLine()
        line.product_order_id = product_order_id
        line.order_type = order_type
        return read_product_order_by_id(line, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/process_order",)
async def __process_order(
                        order: schemas.ProductOrder,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        result = process_order(order, db, query)

        #####
        #  Web Socket Updated
        #####
        order: schemas.ProductOrder = result['order']

        sharable: dict = {
            'origin': 'ORDER_PROCESSED',
            'marker': 'processed',
            'body': {
                'order': {
                    'id': order.id,
                    'name': order.name,
                    'memo': order.memo,
                    'status': "processed",
                    'user_receiver': order.user_receiver,
                    'user_requester': order.user_requester,
                    'issues': []
                }
            }
        }

        store: str = order.from_store.name
        await myvar.set('sharable', sharable)
        client_uuid_list = await myvar.get('client_uuid_list')
        sharable_per_client = await myvar.get('sharable_per_client')
        for uniquename in client_uuid_list:
            if uniquename == store:
                sharable_per_client.append({'client_uuid': uniquename, 'sharable': sharable})
                await myvar.set('sharable_per_client', sharable_per_client)

        return result
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/rollback_order",)
async def __rollback_order(
                        order: schemas.ProductOrder,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        result = rollback_order(order, db, query)
        #####
        #  Web Socket Updated
        #####
        order: schemas.ProductOrder = result['order']

        sharable: dict = {
            'origin': 'ORDER_CANCELLED',
            'marker': 'cancelled',
            'body': {
                'order': {
                    'id': order.id,
                    'name': order.name,
                    'memo': order.memo,
                    'status': "cancelled",
                    'user_receiver': order.user_receiver,
                    'user_requester': order.user_requester,
                    'issues': []
                }
            }
        }

        store: str = order.to_store.name
        await myvar.set('sharable', sharable)
        client_uuid_list = await myvar.get('client_uuid_list')
        sharable_per_client = await myvar.get('sharable_per_client')
        for uniquename in client_uuid_list:
            if uniquename == store:
                sharable_per_client.append({'client_uuid': uniquename, 'sharable': sharable})
                await myvar.set('sharable_per_client', sharable_per_client)

        return result
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.get("/bulk_order/{id}", response_model=list[schemas.ProductOrder])
async def __read_bulk_order(
                        order_type: str,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        return read_product_order(order_type, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/assign_order_to_bulk",)
async def __assign_order_to_bulk(
                        line: schemas.BulkOrderLine,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        return assign_order_to_bulk(line, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.get("/read_bulk_order", response_model=list[schemas.BulkOrder])
async def __read_bulk_order(
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        return read_bulk_order(db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.post("/add_bulk_order", response_model=list[schemas.BulkOrder])
async def __add_bulk_order(
                        bo: schemas.BulkOrder,
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        return add_bulk_order(bo, db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.get("/delivery", response_model=list[schemas.Delivery])
async def __delivery(
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        return delivery(db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.get("/sales_total",)
async def sales_total(
                        db: Session = Depends(get_db),
                        token_info: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    try:
        return read_sales_total(db, query)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))



###################################################
#  Web Socket Part
###################################################

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


@router.websocket("/messages/{store}")
async def messages_endpoint(websocket: WebSocket, store: str):
    manager = ConnectionManager()
    await manager.connect(websocket, store, myvar=myvar)
    await websocket.send_json({'Welcome': store})
    print('Wating for new events [send_periodically] ....')
    await asyncio.create_task(send_periodically(websocket, manager, store, 0.9, myvar=myvar))
