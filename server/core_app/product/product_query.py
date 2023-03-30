from sqlalchemy.orm import Session
import server.core_app.product.product_models as models
from server.core_app.product.product_schemas import Pricing
from server.core_app.product.product_schemas import Product
from server.core_app.dbfs.Query import Query
from server.core_app.database import get_cursor

# TODO refactor to find DEFAULT store and NOT a list of stores for keep SIMPLE on UI
# TODO iterate over stores and SET product.inventory.quantity TO product.quantity
def read_products(store: str, db: Session, query: Query):
    sql_raw = query.SELECT_PRODUCT

    products = []

    cur = get_cursor(db)
    cur.execute(sql_raw, (store, )) # TODO yeah, getting DEFAULT store from UI
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
        inventory.stores.append(store)
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
            pri.price_key = l['price_key']
            pri.label = l['label']
            li.pricing = pri
            plist.append(li)
        product.pricinglist = plist
        products.append(product)

    return products


def read_pricing_labels(db: Session, query: Query):
    sql_raw = query.SELECT_PRICING_LABELS
    pricings = []
    cur = get_cursor(db)
    cur.execute(sql_raw)
    resp = cur.fetchall()

    for rp in resp:
        pricing = models.Pricing()
        pricing.id = rp['id']
        pricing.label = rp['label']
        pricing.price_key = rp['price_key']
        pricings.append(pricing)

    return pricings


def update_one(pricing_id: int, field: str, value: str, product_id: int, db: Session):
    print(f'field: {field}, value: {value}, price_column: {pricing_id}')
    # product = db.query(models.Product).get(product_id)
    # if product is not None:
    #     product.update({field: value})
    #
    # print(product)

    cur = get_cursor(db)

    if pricing_id != -1:
        sql_raw_update = f'UPDATE pricing_list SET price = "{value}" WHERE product_id = %s AND pricing_id = %s;'
        cur.execute(sql_raw_update, (product_id, pricing_id,))
    else:
        sql_raw_update = f'UPDATE product SET {field} = "{value}" WHERE id = %s;'
        cur.execute(sql_raw_update, (product_id,))

    print(sql_raw_update)
    cur.connection.commit()


def read_pricing(db: Session, query: Query):
    sql_raw = query.SELECT_PRICING
    pricings = []
    cur = get_cursor(db)
    cur.execute(sql_raw)
    resp = cur.fetchall()

    for rp in resp:
        pricing = models.Pricing()
        pricing.id = rp['id']
        pricing.label = rp['label']
        pricing.price_key = rp['price_key']
        pricing.date_create = rp['date_create']
        pricing.status = rp['status']
        pricing.user_modified = rp['user_modified']
        pricings.append(pricing)

    return pricings


def add_pricing(price: Pricing, percent: float, db: Session, query: Query):
    sql_raw_insert_pricing = query.INSERT_PRICING
    cur = get_cursor(db)
    data = (price.label, price.price_key, price.user_modified)
    cur.execute(sql_raw_insert_pricing, data)
    cur.connection.commit()
    pricing_id = cur.lastrowid

    sql_raw_insert_pricing_list = query.INSERT_PRICING_LIST
    data = (percent, price.user_modified, pricing_id)
    cur.execute(sql_raw_insert_pricing_list, data)
    cur.connection.commit()

    return read_pricing(db, query)


def update_pricing(price_id: int, field: str, value: str, db: Session, query: Query):
    cur = get_cursor(db)

    sql_raw_update = f'UPDATE pricing SET {field} = "{value}" WHERE id = %s;'
    cur.execute(sql_raw_update, (price_id,))
    print(sql_raw_update)
    cur.connection.commit()

    return read_pricing(db, query)


def add_product(product: Product,  db: Session, query: Query):
    sql_raw_insert_product = query.INSERT_PRODUCT
    cur = get_cursor(db)
    data = (product.name, product.cost, product.code, product.user_modified)
    cur.execute(sql_raw_insert_product, data)
    cur.connection.commit()
    product_id = cur.lastrowid

    # sql_raw_insert_product_pricing = query.INSERT_PRUDUCT_PRICING
    # for s in product.inventory.stores:
    #     data = (product., price.user_modified, pricing_id)
    #     cur.execute(sql_raw_insert_product_pricing, data)
    #     cur.connection.commit()

    return read_pricing(db, query)

