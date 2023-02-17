import os

from fastapi import APIRouter, Depends, HTTPException, Security, Header
from typing import Optional
from sqlalchemy.orm import Session
from server.core_app.database import get_db
from server.core_app.product.product_query import read_products
import server.core_app.product.product_schemas as schemas
import server.core_app.user.user_models as models
from server.core_app.user.user_query import validate_permissions
from server.core_app.dbfs.Query import Query


router = APIRouter(prefix='/products', tags=['products'])
path = os.getcwd() + '/server/core_app/dbfs/query.sql'
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
