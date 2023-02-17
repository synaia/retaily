from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from core_app.database import get_db
from core_app.user.user_query import validate_permissions
import core_app.client.client_schemas as schemas
import core_app.user.user_models as models
from core_app.client.client_query import read_clients


router = APIRouter(prefix='/clients', tags=['clients'])


@router.get("/", response_model=list[schemas.Client])
async def get_clients(
        db: Session = Depends(get_db),
        user_active: models.User = Security(dependency=validate_permissions, scopes=["human"])
):
    products = read_clients(db)
    return products
