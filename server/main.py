from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import server.core_app.product.product_main as product_main
import server.core_app.user.user_main as user_main
import server.core_app.client.client_main as client_main
import uvicorn

# import logging
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

origins = [
    "http://localhost:9080",
]

app = FastAPI()

app.include_router(product_main.router)
app.include_router(user_main.router)
app.include_router(client_main.router)

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
    uvicorn.run(app, host="0.0.0.0", port=8000)
