from sqlalchemy.orm import Session
import server.core_app.product.product_models as models
from server.core_app.dbfs.Query import Query
from server.core_app.database import get_cursor


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


def read_all_products(db: Session, query: Query):
    sql_raw = query.SELECT_ALL_PRODUCT
    sql_raw_pricinglist = query.SELECT_PRICING_LIST

    products = []

    cur = get_cursor(db)
    cur.execute(sql_raw)
    resp = cur.fetchall()

    for rp in resp:
        product = models.Product()
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

        cur.execute(sql_raw_pricinglist, (product.id,))
        pricings = cur.fetchall()
        plist = []
        for l in pricings:
            li = models.PricingList()
            pri = models.Pricing()
            li.id = l['id']
            li.price = l['price']
            li.user_modified = l['user_modified']
            li.date_create = l['date_create']
            pri.name = l['name_price_list']
            li.pricing = pri
            plist.append(li)
        product.pricinglist = plist
        products.append(product)

    return products


def update_one(field: str, value: str, product_id: int, db: Session):
    print(f'field: {field}, value: {value}')
    # product = db.query(models.Product).get(product_id)
    # if product is not None:
    #     product.update({field: value})
    #
    # print(product)

    sql_raw_update = f'UPDATE product SET {field} = "{value}" WHERE id = %s;'
    print(sql_raw_update)
    cur = get_cursor(db)
    cur.execute(sql_raw_update, (product_id,))
    cur.connection.commit()
