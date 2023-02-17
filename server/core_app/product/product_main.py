from fastapi import APIRouter, Depends, HTTPException, Security, Header
from typing import Optional
from sqlalchemy.orm import Session
from core_app.database import get_db
from core_app.product.product_query import read_products
import core_app.product.product_schemas as schemas
import core_app.user.user_models as models
from core_app.user.user_query import validate_permissions
from core_app.dbfs.Query import Query


router = APIRouter(prefix='/products', tags=['products'])

query = Query('./dbfs/query.sql')


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
