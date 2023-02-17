from sqlalchemy.orm import Session
import server.core_app.user.user_models as models
from datetime import datetime, timedelta
from typing import List
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, ValidationError
from server.core_app.database import get_db


# openssl rand -hex 32
SECRET_KEY = "82b033a1e8d51dfeb8503f722bb194ab9187ebe7163ea2f47ef0b29c38dd42ad"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60*5


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes={
            "me": "Read information about the current user.",
            "items": "Read items.",
            "sales": "Can see sales and products.",
    },
)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


class Token(BaseModel):
    access_token: str
    token_type: str
    scopes: List[str] = []
    stores: List[str] = []


class TokenData(BaseModel):
    username: str | None = None
    scopes: List[str] = []


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def validate_user(
    security_scopes: SecurityScopes, token: str = Depends(oauth2_scheme),
):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"

    credentials_expired = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")

        if username is None:
            raise credentials_expired

        token_scopes = payload.get("scopes", [])
        user_active  = payload.get("is_active")
        token_data = TokenData(scopes=token_scopes, username=username)
    except (JWTError, ValidationError) as ex:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(ex),
            headers={"WWW-Authenticate": authenticate_value},
        )

    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )

    return user_active


async def validate_permissions(user_active: models.User = Security(validate_user)):
    if not user_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user_active


def create_user(user, db: Session):
    user.password = get_password_hash(user.password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user(username: str, db: Session):
    res = db.query(models.User).filter(models.User.username == username).first()
    return res


def get_users(db: Session):
    # res = db.query(models.User, models.Scopes).filter(models.User.id == models.Scopes.user_id).all()
    res = db.query(models.User).all()
    return res


def authenticate_user(username: str, password: str, db: Session):
    user = get_user(username, db)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user
