import os
import sys

from fastapi import APIRouter, Depends, HTTPException, Security, Header
from typing import Optional
from sqlalchemy.orm import Session
from server.core_app.database import get_db
import server.core_app.sale.sale_schemas as schemas
from server.core_app.sale.sale_query import read_sales
import server.core_app.user.user_models as models
from server.core_app.user.user_query import validate_permissions
from server.core_app.dbfs.Query import Query


router = APIRouter(prefix='/sales', tags=['sales'])
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


@router.get("/", response_model=list[schemas.Sale])
async def get_sales(
        init_date: str,
        end_date: str,
        invoice_status: str,
        client_id: int,
        db: Session = Depends(get_db),
        store: Optional[str] = Header(None),
        user_active: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    sales = read_sales(init_date, end_date, store, invoice_status, client_id, db, query)
    return sales
