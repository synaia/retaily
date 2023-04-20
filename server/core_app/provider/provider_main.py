import os
import sys
from fastapi import APIRouter, Depends, HTTPException, Security, status
from sqlalchemy.orm import Session
from server.core_app.database import get_db
from server.core_app.user.user_query import validate_permissions
import server.core_app.provider.provider_schemas as schemas
import server.core_app.user.user_models as models
from server.core_app.provider.provider_query import read_providers
from server.core_app.dbfs.Query import Query


router = APIRouter(prefix='/provider', tags=['provider'])

gettrace = getattr(sys, 'gettrace', None)
# is debug mode :-) ?
if gettrace():
    path = os.getcwd() + '/dbfs/query.sql'
    print('Debugging :-* ')
else:
    path = os.getcwd() + '/server/core_app/dbfs/query.sql'
    print('Run normally.')

query = Query(path)


@router.get("/", response_model=list[schemas.Provider])
async def get_providers(
        db: Session = Depends(get_db),
        user_active: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    products = read_providers(db, query)
    return products


@router.post("/add", response_model=schemas.Provider)
async def add_provider(
        provider: schemas.Provider,
        db: Session = Depends(get_db),
        user_active: models.User = Security(dependency=validate_permissions, scopes=["sales"])
):
    pass
