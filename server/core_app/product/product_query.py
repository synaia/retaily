import numpy as np
from sqlalchemy.orm import Session
import server.core_app.product.product_models as models
from server.core_app.product.product_schemas import Pricing
from server.core_app.product.product_schemas import Product
from server.core_app.product.product_schemas import PricingList
from server.core_app.product.product_schemas import Inventory
from server.core_app.product.product_schemas import InventoryHead
from server.core_app.product.product_schemas import Store
from server.core_app.product.product_schemas import ProductOrder, ProductOrderLine
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


def read_all_inv_products(db: Session, query: Query):
    sql_raw: str = query.SELECT_ALL_PRODUCT
    sql_raw_product_inv: str = query.SELECT_PRODUCT_ALL_INV

    products: list = []
    count_resume: dict = {}

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

        cur.execute(sql_raw_product_inv, (product.id,))
        inv = cur.fetchall()
        invlist: list = []
        changed_count: int = 0
        inv_valuation: float = 0.0
        inv_valuation_changed: float = 0.0
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

            if inventory.status == 'changed':
                try:
                    changed_count = count_resume[store.name]['changed_count'] + 1
                except Exception as ex:
                    changed_count = 1
            else:
                try:
                    changed_count = count_resume[store.name]['changed_count']
                except Exception as ex:
                    changed_count = 0

            try:
                inv_valuation = count_resume[store.name]['inv_valuation'] + (product.cost * inventory.quantity)
            except Exception as ex:
                inv_valuation = (product.cost * inventory.quantity)

            if inventory.status == 'changed':
                try:
                    inv_valuation_changed = count_resume[store.name]['inv_valuation_changed'] + (product.cost * inventory.quantity)
                except Exception as ex:
                    inv_valuation_changed = (product.cost * inventory.quantity)
            else:
                try:
                    inv_valuation_changed = count_resume[store.name]['inv_valuation_changed']
                except Exception as ex:
                    inv_valuation_changed = 0

            count_resume[store.name]: dict = {
                'changed_count': changed_count,
                'inv_valuation': inv_valuation,
                'inv_valuation_changed': inv_valuation_changed
            }

        product.inventory = invlist

        products.append(product)
        # sort changed to top
        # TODO: depend on inventory/store selectec
        # products = sorted(products, key=lambda p: p.inventory[0].status, reverse=False)

        result = {
            'products': products,
            'count_resume': count_resume
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


def read_inventory_head_by_store_id(store_id: int, db: Session, query: Query):
    sql_raw_inv_head = query.SELECT_INV_HEAD_BYSTOREID
    cur = get_cursor(db)
    cur.execute(sql_raw_inv_head, (store_id,))
    r = cur.fetchall()
    head = InventoryHead()
    if len(r) > 0:
        head.id = r[0]['id']
        head.name = r[0]['name']
        head.date_create = r[0]['date_create']
        head.date_close = r[0]['date_close']
        head.status = r[0]['status']
        head.memo = r[0]['memo']
        head.build_meta(1, SUCCESS, SUCCESS)
    else:
        head.build_meta(0, FAIL, f'Not app_inventory_head defined for id: {store_id}')

    return head


def read_stores_inv(db: Session, query: Query):
    sql_raw = query.SELECT_STORES
    sql_raw_inv_valuation = query.SELECT_INV_VALUATION
    sql_raw_inv_valuation_changed = query.SELECT_INV_VALUATION_CHANGED

    inventory_head_list = []
    resume = {}
    cur = get_cursor(db)
    cur.execute(sql_raw)
    resp = cur.fetchall()
    for rp in resp:
        store = Store()
        store.id = rp['id']
        store.name = rp['name']
        head = read_inventory_head_by_store_id(store.id, db, query)
        head.store = store
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

    stores_inv = read_stores_inv(db, query)
    return {
        'next_quantity': next_quantity,
        'product_id': product_id,
        'store_id': store_id,
        'stores_inv': stores_inv
    }


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


def cancel_inventory_in_progress(store: Store,  db: Session, query: Query):
    sql_raw_calcel_inv = query.CLOSE_INVENTORY_HEAD_CANCEL
    sql_raw_calcel = query.CLOSE_INVENTORY_CANCEL
    cur = get_cursor(db)
    data = (store.id,)
    cur.execute(sql_raw_calcel_inv, data)
    cur.connection.commit()

    cur.execute(sql_raw_calcel, data)
    cur.connection.commit()

    return read_inventory_head(store.name, db, query)


def add_app_store(store_name: str, db: Session, query: Query):
    sql_raw_app_store = query.INSERT_APP_STORE
    cur = get_cursor(db)
    data = (store_name,)
    cur.execute(sql_raw_app_store, data)
    cur.connection.commit()
    store_id = cur.lastrowid

    sql_raw_insert_app_inv_store = query.INSERT_APP_INV_STORE
    data = (store_id,)
    cur.execute(sql_raw_insert_app_inv_store, data)
    cur.connection.commit()

    return read_stores_inv(db, query)


def __iterate_over_order_line(hresp: tuple):
    product_order_line = []
    for h in hresp:
        line = ProductOrderLine()
        line.id = h['id']
        line.product_id = h['product_id']
        from_store = Store()
        from_store.id = h['from_store_id']
        line.from_store = from_store
        to_store = Store()
        to_store.id = h['to_store_id']
        line.to_store = to_store
        line.product_order_id = h['product_order_id']
        line.quantity = h['quantity']
        line.quantity_observed = h['quantity_observed']
        line.status = h['status']
        line.date_create = h['date_create']
        product = Product()
        product.id = line.product_id
        product.name = h['product_name']
        product.cost = h['cost']
        product.code = h['code']
        product.active = h['active']
        line.product = product
        product_order_line.append(line)
    return product_order_line


def read_product_order(db: Session, query: Query):
    sql_raw = query.SELECT_FROM_PRODUCT_ORDER
    sql_raw_product_order_line = query.SELECT_FROM_PRODUCT_ORDER_LINE
    cur = get_cursor(db)
    cur.execute(sql_raw)
    resp = cur.fetchall()

    orders = []

    for r in resp:
        order = ProductOrder()
        order.id = r['id']
        order.name = r['name']
        order.memo = r['memo']
        order.order_type = r['order_type']
        order.status = r['status']
        order.products_in_order = r['products_in_order']
        order.products_in_order_issue = r['products_in_order_issue']
        order.user_requester = r['user_requester']
        order.user_receiver = r['user_receiver']
        order.date_opened = r['date_opened']
        order.date_closed = r['date_closed']
        order.value_in_order = r['value_in_order']
        from_store = Store()
        from_store.id = r['from_store_id']
        from_store.name = r['from_store_name']
        order.from_store = from_store
        to_store = Store()
        to_store.id = r['to_store_id']
        to_store.name = r['to_store_name']
        order.to_store = to_store

        data = (order.id,)
        cur.execute(sql_raw_product_order_line, data)
        hresp = cur.fetchall()
        order.product_order_line = __iterate_over_order_line(hresp)
        orders.append(order)

    return orders


def read_product_order_by_id(product_order_id: int, db: Session, query: Query):
    sql_raw = query.SELECT_FROM_PRODUCT_ORDER_BYID
    sql_raw_product_order_line = query.SELECT_FROM_PRODUCT_ORDER_LINE
    cur = get_cursor(db)
    data = (product_order_id,)
    cur.execute(sql_raw, data)
    resp = cur.fetchall()

    for r in resp:   # Get ONE record because product_order_id
        order = ProductOrder()
        order.id = r['id']
        order.name = r['name']
        order.memo = r['memo']
        order.order_type = r['order_type']
        order.status = r['status']
        order.products_in_order = r['products_in_order']
        order.products_in_order_issue = r['products_in_order_issue']
        order.user_requester = r['user_requester']
        order.user_receiver = r['user_receiver']
        order.date_opened = r['date_opened']
        order.date_closed = r['date_closed']
        order.value_in_order = r['value_in_order']
        from_store = Store()
        from_store.id = r['from_store_id']
        from_store.name = r['from_store_name']
        order.from_store = from_store
        to_store = Store()
        to_store.id = r['to_store_id']
        to_store.name = r['to_store_name']
        order.to_store = to_store

        data = (order.id,)
        cur.execute(sql_raw_product_order_line, data)
        hresp = cur.fetchall()
        order.product_order_line = __iterate_over_order_line(hresp)

    return order


def read_product_order_line_by_id(product_order_line_id: int, db: Session, query: Query):
    sql_raw = query.SELECT_FROM_PRODUCT_ORDER_LINE_BYID
    cur = get_cursor(db)
    data = (product_order_line_id,)
    cur.execute(sql_raw, data)
    resp = cur.fetchall()
    line = ProductOrderLine()
    for h in resp:
        line.id = h['id']
        line.product_id = h['product_id']
        from_store = Store()
        from_store.id = h['from_store_id']
        line.from_store = from_store
        to_store = Store()
        to_store.id = h['to_store_id']
        line.to_store = to_store
        line.product_order_id = h['product_order_id']
        line.quantity = h['quantity']
        line.quantity_observed = h['quantity_observed']
        line.status = h['status']
        line.date_create = h['date_create']
        line.build_meta(1, SUCCESS, SUCCESS)
    return line


def read_product_order_by_store(store_id: int, db: Session, query: Query):
    pass


def add_product_order(product_order: ProductOrder, db: Session, query: Query):
    sql_raw_add_product_order = query.INSERT_PRODUCT_ORDER
    cur = get_cursor(db)
    data = (product_order.name, product_order.memo, product_order.order_type,
            product_order.user_requester, product_order.from_store.id, product_order.to_store.id)
    cur.execute(sql_raw_add_product_order, data)
    cur.connection.commit()
    product_order_id = cur.lastrowid

    return read_product_order(db, query)


def add_product_order_line(line: ProductOrderLine, db: Session, query: Query):
    sql_raw_add_product_order_line = query.INSERT_PRODUCT_ORDER_LINE
    sql_raw_validate_line = query.VALIDATE_PRODUCT_ORDER_LINE_EXIST
    sql_raw_update_line = query.UPDATE_PRODUCT_ORDER_LINE
    sql_raw_delete_line = query.DELETE_PRODUCT_ORDER_LINE
    sql_raw_select_line_byargs = query.SELECT_FROM_PRODUCT_ORDER_LINE_BYARGS
    sql_raw_substract_from_store = query.SUBSTRACT_FROM_STORE
    sql_raw_substract_from_store_dtpq = query.SUBSTRACT_FROM_STORE_DONTTOUCH_PREV_QUANTITY
    sql_raw_app_inventory_remain_qty = query.APP_INVENTORY_REMAIN_QUANTITY

    cur = get_cursor(db)
    data = (line.product_order_id, line.product_id)
    cur.execute(sql_raw_validate_line, data)
    resp = cur.fetchall()
    line_count: int = 0 if resp[0]['line_count'] is None else resp[0]['line_count']
    if line_count == 0: # add quantity
        # substract quantity from store
        if line.quantity != 0:
            data = (line.quantity, line.user_receiver, line.from_store.id, line.product_id)
            cur.execute(sql_raw_substract_from_store, data)
            cur.connection.commit()

            # reserve quantity
            data = (line.product_id, line.from_store.id, line.to_store.id, line.product_order_id, line.quantity, line.quantity)
            cur.execute(sql_raw_add_product_order_line, data)
            cur.connection.commit()

    else:              # update quantity
        data = (line.product_order_id, line.product_id)
        cur.execute(sql_raw_select_line_byargs, data)
        resp = cur.fetchall()
        product_order_quantity = resp[0]['quantity']
        product_order_status = resp[0]['status']
        abs_quantity = line.quantity - product_order_quantity

        data = (abs_quantity, line.user_receiver, line.from_store.id, line.product_id)
        cur.execute(sql_raw_substract_from_store_dtpq, data)
        cur.connection.commit()

        if line.quantity == 0:
            data = (line.product_order_id, line.product_id)
            cur.execute(sql_raw_delete_line, data)
            cur.connection.commit()
        else:
            if product_order_status == 'issue':
                status: str = 'issue' if line.quantity != product_order_quantity else 'pending'
            else:
                status: str = product_order_status
            data = (line.quantity, line.quantity, status, line.product_order_id, line.product_id)
            cur.execute(sql_raw_update_line, data)
            cur.connection.commit()

    data = (line.from_store.id, line.product_id)
    cur.execute(sql_raw_app_inventory_remain_qty, data)
    resp = cur.fetchall()
    remaining_quantity = resp[0]['quantity']
    order = read_product_order_by_id(line.product_order_id, db, query)

    return {
        '_order': order,
        'remaining': {
            'remaining_quantity': remaining_quantity,
            'product_id': line.product_id,
            'store_id': line.from_store.id
        }
    }


def process_order(product_order: ProductOrder, db: Session, query: Query):
    sql_raw_process_app_inv = query.PROCESS_APP_INVENTORY
    sql_raw_process_app_inv_issue_back = query.PROCESS_APP_INVENTORY_ISSUE_BACK
    sql_raw_process_order_line = query.UPDATE_ORDER_LINE_PROCESS
    sql_raw_product_order_process = query.UPDATE_PRODUCT_ORDER_PROCESS

    cur = get_cursor(db)

    # first: check for any issue correction.
    data = (product_order.id, product_order.user_receiver)
    cur.execute(sql_raw_process_app_inv_issue_back, data)
    cur.connection.commit()

    data = (product_order.id, product_order.user_receiver)
    cur.execute(sql_raw_process_app_inv, data)
    cur.connection.commit()

    data = (product_order.id,)
    cur.execute(sql_raw_process_order_line, data)
    cur.connection.commit()

    data = (product_order.user_receiver, product_order.id,)
    cur.execute(sql_raw_product_order_process, data)
    cur.connection.commit()

    return read_product_order_by_id(product_order.id, db, query)


def rollback_order(product_order: ProductOrder, db: Session, query: Query):
    sql_raw_rollback_app_inv = query.ROLLBACK_APP_INVENTORY
    sql_raw_cancel_order_line = query.CANCEL_ORDER_LINE
    sql_raw_cancel_order = query.CANCEL_ORDER

    cur = get_cursor(db)

    data = (product_order.id, product_order.user_receiver)
    cur.execute(sql_raw_rollback_app_inv, data)
    cur.connection.commit()

    data = (product_order.id,)
    cur.execute(sql_raw_cancel_order_line, data)
    cur.connection.commit()

    data = (f' CANCELLED: [{product_order.memo}]', product_order.id)
    cur.execute(sql_raw_cancel_order, data)
    cur.connection.commit()

    return read_product_order_by_id(product_order.id, db, query)


def issue_order_line(line: ProductOrderLine, db: Session, query: Query):
    sql_raw_update_line_issue = query.UPDATE_PRODUCT_ORDER_LINE_ISSUE_COUNT
    cur = get_cursor(db)
    status: str = 'issue' if line.quantity != line.quantity_observed else 'pending'
    data = (line.quantity_observed, line.user_receiver, line.receiver_memo, status, line.product_order_id, line.product_id)
    cur.execute(sql_raw_update_line_issue, data)
    cur.connection.commit()

    return read_product_order_by_id(line.product_order_id, db, query)
