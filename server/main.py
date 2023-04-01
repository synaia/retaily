import os
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from starlette.middleware.cors import CORSMiddleware
import server.core_app.product.product_main as product_main
import server.core_app.user.user_main as user_main
import server.core_app.client.client_main as client_main
import server.core_app.sale.sale_main as sale_main
import uvicorn

# import logging
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# openssl genrsa -out key.pem 2048
# openssl rsa -in key.pem -outform PEM -pubout -out public.pem
base_path = os.getcwd()
key_pem = os.getcwd() + '/../certs/key.pem'
public_pem = os.getcwd() + '/../certs/public.crt'


origins = [
    "http://localhost:3000",
    "http://localhost:9080",
    "https://localhost:9080",
    "http://10.0.0.6:9080",
    "https://10.0.0.6:9080",
    "https://10.0.0.62:9080",
    "https://10.0.0.233:9080",
    "https://10.0.0.61:9080",
    "https://10.0.0.6:9080",
    "https://10.0.0.6:8001",
    "https://localhost:8001",
]

app = FastAPI(ssl_keyfile=key_pem, ssl_certfile=public_pem)

app.include_router(product_main.router)
app.include_router(user_main.router)
app.include_router(client_main.router)
app.include_router(sale_main.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
async def root():
    return {'message': 'Message from root.'}


# debug mode :-)
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8500, ssl_keyfile=key_pem, ssl_certfile=public_pem)
