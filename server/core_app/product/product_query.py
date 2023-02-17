from sqlalchemy.orm import Session
import core_app.product.product_models as models
from core_app.dbfs.Query import Query
from core_app.database import get_cursor


def read_products(store: str, db: Session, query: Query):
    sql_raw = query.SELECT_PRODUCT

    products = []

    cur = get_cursor(db)
    cur.execute(sql_raw, (store, ))
    resp = cur.fetchall()

    for rp in resp:
        product = models.Product()
        inventory = models.Inventory()
        store = models.Store()
        product.id = rp['id']
        product.name = rp['name']
        product.cost = rp['cost']
        product.price = rp['price']
        product.margin = rp['margin']
        product.code = rp['code']
        product.img_path = rp['img_path']
        product.date_create = rp['date_create']
        product.active = rp['active']
        product.image_raw = rp['image_raw']
        inventory.quantity = rp['quantity']
        store.name = rp['store_name']
        inventory.store = store
        product.inventory = inventory
        products.append(product)

    return products
