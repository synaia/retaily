import os
import sys

from fastapi import APIRouter, Depends, HTTPException, Security, Header, status
from typing import Optional
from sqlalchemy.orm import Session
from server.core_app.database import get_db
from server.core_app.product.product_query import read_products, read_all_products, read_pricing_labels,  update_one, add_pricing, read_pricing, update_pricing
import server.core_app.product.product_schemas as schemas
import server.core_app.user.user_models as models
from server.core_app.user.user_query import validate_permissions
from server.core_app.dbfs.Query import Query


router = APIRouter(prefix='/products', tags=['products'])
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
async def get_pricing_labels(
        db: Session = Depends(get_db),
        store: Optional[str] = Header(None),
        user_active: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    pricings = read_pricing(db, query)
    return pricings


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
