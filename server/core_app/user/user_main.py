from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, Security, status
from sqlalchemy.orm import Session
from server.core_app.database import get_db
import server.core_app.user.user_query as user_query
import server.core_app.user.user_schema as schemas
import server.core_app.user.user_models as models
from server.core_app.user.user_query import Token
from server.core_app.user.user_query import create_access_token
from server.core_app.user.user_query import ACCESS_TOKEN_EXPIRE_MINUTES
from server.core_app.user.user_query import validate_permissions

router = APIRouter(prefix='/users', tags=['users'])


@router.post("/add", response_model=schemas.User)
async def create(user: schemas.User, db: Session = Depends(get_db)):
    new_user = models.User(**{
        'username': user.username,
        'password': user.password,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_active': user.is_active,
        'date_joined': user.date_joined,
        'last_login': user.last_login,
    })
    for sco in user.scope:
        new_user.scope.append(models.Scope(**sco.dict()))

    # also append Stores :-)

    try:
        return user_query.create_user(new_user, db)
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@router.get("/", response_model=list[schemas.User])
async def get(db: Session = Depends(get_db)):
    users = user_query.get_users(db)
    return users


@router.get('/{username}', response_model=schemas.User)
async def get_user(username: str, db: Session = Depends(get_db)):
    user = user_query.get_user(username, db)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/token", response_model=Token)
async def login_for_access_token(username: str, password: str,  db: Session = Depends(get_db)):
    user = user_query.authenticate_user(username, password, db)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    scopes = [s.name for s in user.scope]
    stores = [s.name for s in user.stores]
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "scopes": scopes, "stores": stores, "is_active": user.is_active},
        expires_delta=access_token_expires,
    )
    return {
            "access_token": access_token,
            "token_type": "bearer",
            "scopes": scopes,
            "stores": stores,
            "pic": user.pic
        }





# @router.post("/token", response_model=Token)
# async def login_for_access_token(user: schemas.User,):
#     user = authenticate_user(fake_users_db, user.username, user.password)
#     if not user:
#         raise HTTPException(status_code=400, detail="Incorrect username or password")
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(
#         data={"sub": user.username, "scopes": user.scopes},
#         expires_delta=access_token_expires,
#     )
#     return {"access_token": access_token, "token_type": "bearer", "scopes": user.scopes}