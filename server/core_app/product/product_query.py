import numpy as np
from sqlalchemy.orm import Session
import server.core_app.product.product_models as models
from server.core_app.product.product_schemas import Pricing
from server.core_app.product.product_schemas import Product
from server.core_app.product.product_schemas import PricingList
from server.core_app.product.product_schemas import Inventory
from server.core_app.product.product_schemas import InventoryHead
from server.core_app.product.product_schemas import Store
from server.core_app.dbfs.Query import Query
from server.core_app.database import get_cursor
from server.core_app.ext.remove_bg import image_to_base64

from server.core_app.basemodeler.BaseModelExt import SUCCESS, FAIL


# TODO refactor to find DEFAULT store and NOT a list of stores for keep SIMPLE on UI
# TODO iterate over stores and SET product.inventory.quantity TO product.quantity
def read_products(store: str, db: Session, query: Query):
    sql_raw = query.SELECT_PRODUCT

    products = []

    cur = get_cursor(db)
    cur.execute(sql_raw, (store, )) # TODO yeah, getting DEFAULT store from UI
    resp = cur.fetchall()

    for rp in resp:
        product = Product()
        inventory = Inventory()
        store = Store()
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
        product.inventory.append(inventory)
        products.append(product)

    return products


def read_all_products(db: Session, query: Query, product_id: int = -1):
    sql_raw = query.SELECT_ALL_PRODUCT if product_id == -1 else query.SELECT_ALL_PRODUCT_BY_ID
    sql_raw_pricinglist = query.SELECT_PRICING_LIST

    products = []

    cur = get_cursor(db)

    if product_id == -1:
        cur.execute(sql_raw)
    else:
        cur.execute(sql_raw, (product_id,))

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


def read_inv_products(store_name: str, db: Session, query: Query):
    sql_raw = query.SELECT_ALL_PRODUCT
    sql_raw_product_inv = query.SELECT_PRODUCT_INV

    products = []

    cur = get_cursor(db)

    cur.execute(sql_raw)

    resp = cur.fetchall()

    for rp in resp:
        product = Product()
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

        cur.execute(sql_raw_product_inv, (product.id, store_name))
        inv = cur.fetchall()
        invlist = []
        for l in inv:
            inventory = Inventory()
            store = Store()
            inventory.id = l['id']
            inventory.prev_quantity = l['prev_quantity']
            inventory.quantity = l['quantity']
            inventory.next_quantity = l['next_quantity']
            inventory.status = l['status']
            store.id = l['store_id']
            store.name = l['name']
            inventory.store = store
            invlist.append(inventory)

        product.inventory = invlist

        products.append(product)
        # sort changed to top
        products = sorted(products, key=lambda p: p.inventory[0].status, reverse=False)

        # some resume info
        changed_count = len([p for p in products if p.inventory[0].status == 'changed'])
        inv_valuation = np.sum([(p.cost * p.inventory[0].quantity) for p in products])
        inv_valuation_changed = np.sum([(p.cost * p.inventory[0].next_quantity) for p in products if p.inventory[0].status == 'changed'])
        inv_valuation_not_changed = np.sum([(p.cost * p.inventory[0].quantity) for p in products if p.inventory[0].status != 'changed'])

        result = {
            'products': products,
            'changed_count': changed_count,
            'inv_valuation': inv_valuation,
            'inv_valuation_changed': inv_valuation_changed,
            'inv_valuation_not_changed': inv_valuation_not_changed
        }

    return result


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


def read_stores(db: Session, query: Query):
    sql_raw = query.SELECT_STORES
    stores = []
    cur = get_cursor(db)
    cur.execute(sql_raw)
    resp = cur.fetchall()
    for rp in resp:
        store = Store()
        store.id = rp['id']
        store.name = rp['name']
        stores.append(store)
    return stores


def read_stores_inv(db: Session, query: Query):
    sql_raw = query.SELECT_STORES
    sql_raw_inv_head = query.SELECT_INV_HEAD
    sql_raw_inv_valuation = query.SELECT_INV_VALUATION
    sql_raw_inv_valuation_changed = query.SELECT_INV_VALUATION_CHANGED

    inventory_head_list = []
    resume = {}
    cur = get_cursor(db)
    cur.execute(sql_raw)
    resp = cur.fetchall()
    for rp in resp:
        store = Store()
        head = InventoryHead()
        store.id = rp['id']
        store.name = rp['name']
        head.store = store
        cur.execute(sql_raw_inv_head, (store.id,))
        r = cur.fetchall()
        if len(r) > 0:
            head.id = r[0]['id']
            head.name = r[0]['name']
            head.date_create = r[0]['date_create']
            head.date_close = r[0]['date_close']
            head.status = r[0]['status']
            head.memo = r[0]['memo']

        inventory_head_list.append(head)

        cur.execute(sql_raw_inv_valuation, (store.name,))
        iv = cur.fetchall()
        inv_valuation = iv[0]['inv_valuation']

        cur.execute(sql_raw_inv_valuation_changed, (store.name,))
        ivc = cur.fetchall()
        inv_valuation_changed = 0 if ivc[0]['inv_valuation_changed'] is None else ivc[0]['inv_valuation_changed']
        count_inv_valuation_changed = ivc[0]['count_inv_valuation_changed']

        resume[store.name] = {
            'changed_count': count_inv_valuation_changed,
            'inv_valuation': inv_valuation,
            'inv_valuation_changed': inv_valuation_changed,
            'inv_valuation_not_changed': (inv_valuation - inv_valuation_changed)
        }

    result = {
        'inventory_head_list': inventory_head_list,
        'resume': resume
    }

    return result


def add_product(product: Product,  db: Session, query: Query):
    image_raw = image_to_base64(product.img_path)
    image_raw = f'data:image/png;base64,{image_raw}' if image_raw is not None else image_raw
    sql_raw_insert_product = query.INSERT_PRODUCT
    cur = get_cursor(db)
    data = (product.name, product.cost, product.code, product.user_modified, image_raw)
    cur.execute(sql_raw_insert_product, data)
    cur.connection.commit()
    product_id = cur.lastrowid

    sql_raw_insert_product_inventory = query.INSERT_PRODUCT_INVENTORY
    for inv in product.inventory:
        data = (inv.quantity, product_id, inv.store.id)
        cur.execute(sql_raw_insert_product_inventory, data)
        cur.connection.commit()

    sql_raw_insert_product_pricing = query.INSERT_PRUDUCT_PRICING
    for pl in product.pricinglist:
        data = (pl.price, pl.user_modified, product_id, pl.pricing_id)
        cur.execute(sql_raw_insert_product_pricing, data)
        cur.connection.commit()

    return read_all_products(db, query, product_id=product_id)


def read_inventory_head(store_name: str, db: Session, query: Query):
    sql_raw = query.SELECT_INVENTORY_HEAD
    cur = get_cursor(db)
    data = (store_name,)
    cur.execute(sql_raw, data)
    resp = cur.fetchall()

    head = InventoryHead()
    if len(resp) > 0:
        store = Store()
        head.id = resp[0]['id']
        head.name = resp[0]['name']
        head.date_create = resp[0]['date_create']
        head.date_close = resp[0]['date_close']
        head.status = resp[0]['status']
        head.memo = resp[0]['memo']
        store.id = resp[0]['store_id']
        store.name = resp[0]['store_name']
        head.build_meta(1, SUCCESS, f'OKAY')
    else:
        head.build_meta(0, FAIL, f'Not inventory_head defined for {store_name}')

    return head


def add_new_inventory_head(inventory_head: InventoryHead,  db: Session, query: Query):
    sql_raw_insert_inv_head = query.INSERT_INVENTORY_HEAD
    sql_raw_prepare_for_inv = query.PREPARE_FOR_INVENTORY
    cur = get_cursor(db)
    data = (inventory_head.name, inventory_head.memo, inventory_head.store.id)
    cur.execute(sql_raw_insert_inv_head, data)
    cur.connection.commit()
    inv_head_id = cur.lastrowid

    data = (inventory_head.store.id,)
    cur.execute(sql_raw_prepare_for_inv, data)
    cur.connection.commit()

    return read_inventory_head(inventory_head.store.name, db, query)


def update_next_inventory_qty(next_quantity: int, user_updated: str, product_id: int, store_id: int,  db: Session, query: Query):
    sql_raw_update_next_inventory = query.UPDATE_INVENTORY_NEXT
    cur = get_cursor(db)
    data = (next_quantity, user_updated, product_id, store_id)
    cur.execute(sql_raw_update_next_inventory, data)
    cur.connection.commit()
    app_inventory_id = cur.lastrowid

    return {'next_quantity': next_quantity, 'product_id': product_id, 'store_id': store_id}


def reorder_inventory_qty(store: Store,  db: Session, query: Query):
    sql_raw_reorder_inv = query.REORDER_INVENTORY
    sql_raw_close_inv = query.CLOSE_INVENTORY_HEAD
    cur = get_cursor(db)
    data = (store.id,)
    cur.execute(sql_raw_reorder_inv, data)
    cur.connection.commit()

    cur.execute(sql_raw_close_inv, data)
    cur.connection.commit()

    return read_inventory_head(store.name, db, query)
