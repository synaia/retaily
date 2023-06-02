from sqlalchemy.orm import Session
import server.core_app.sale.sale_models as models
from server.core_app.sale.sale_schemas import SalePaid, Sequence
from server.core_app.client.client_models import Client
from server.core_app.product.product_models import Product
from server.core_app.dbfs.Query import Query
from server.core_app.database import get_cursor
import datetime


def read_sales(init_date: str, end_date: str, store: str, store_s: str, invoice_status: str,
               client_id: int, user_login: str, db: Session, query: Query, token_info: dict):
    sql_raw_paid = query.SELECT_PAID
    sql_raw_line = query.SELECT_LINE
    cur = get_cursor(db)
    invoice_status = ('open', 'cancelled', 'close',) if invoice_status == 'all' else (invoice_status,)

    if 'sales.filter.user' in token_info['token_scopes']:
        user_login: str = '^(.+)$' if user_login == 'all' else user_login
    else:
        user_login: str = user_login if user_login == token_info['username'] else token_info['username']

    if 'sales.filter.store' in token_info['token_scopes']:
        store: str = store if 'same' == store_s else store_s
    else:
        store: str = store

    sql_raw_main = query.SELECT_SALES_BY_INVOICE_STATUS
    if client_id == 0:
        cur.execute(sql_raw_main, (store, init_date, end_date, invoice_status, user_login))
    else:
        sql_raw_main = query.SELECT_SALES_BY_CLIENT
        cur.execute(sql_raw_main, (store, init_date, end_date, invoice_status, client_id, user_login))

    resp = cur.fetchall()

    sales = []
    for rp in resp:
        sale = models.Sale()

        sale.id = rp['id']
        sale.amount = rp['amount']
        sale.sub = rp['sub']
        sale.discount = rp['discount']
        sale.tax_amount = rp['tax_amount']
        sale.delivery_charge = rp['delivery_charge']
        sale.sequence = rp['sequence']
        sale.sequence_type = rp['sequence_type']
        sale.status = rp['status']
        sale.sale_type = rp['sale_type']
        sale.date_create = rp['date_create']
        sale.login = rp['login']
        sale.additional_info = rp['additional_info']
        sale.total_paid = 0 if (rp['total_paid'] is None) else rp['total_paid']
        sale.due_balance = rp['amount'] - sale.total_paid

        # (27105, 27094, 26636, 27104)
        # if 'RETURN' == sale.status:
        #     invoice_status = 'canceled'
        # elif sale.due_balance > 0:
        #     invoice_status = 'open'
        # else:
        #     invoice_status = 'close'

        sale.invoice_status = rp['invoice_status']
        client = Client()
        client.id = rp['client_id']
        client.name = rp['client_name']
        client.document_id = rp['document_id']
        client.celphone = rp['celphone']
        sale.client = client

        cur.execute(sql_raw_line, (sale.id,))
        lines = cur.fetchall()
        sale_lines = []
        for l in lines:
            line = models.SaleLine()
            product = Product()
            line.amount = l['line_amount']
            line.tax_amount = l['line_tax_amount']
            line.discount = l['line_discount']
            line.quantity = l['quantity']
            line.total_amount = l['total_amount']
            product.id = l['product_id']
            product.name = l['product_name']
            product.cost = l['product_cost']
            product.price = l['product_price']
            product.active = l['active']
            line.product = product
            sale_lines.append(line)

        sale.sale_line = sale_lines

        cur.execute(sql_raw_paid, (sale.id,))
        paids = cur.fetchall()
        sale_paids = []
        for p in paids:
            paid = models.SalePaid()
            paid.id = p['paid_id']
            paid.amount = p['paid_amount']
            paid.type = p['paid_type']
            paid.date_create = p['paid_date_create']
            sale_paids.append(paid)

        sale.sale_paid = sale_paids

        sales.append(sale)

    print(len(sales))

    return sales


def add_pay(paids: list[SalePaid], sale_id: int,  db: Session, query: Query):
    print('O_0', sale_id)
    print('paids', paids)
    sql_raw_add_paid = query.INSERT_PAID
    sql_raw_paid = query.SELECT_PAID

    cur = get_cursor(db)
    for pay in paids:
        data = (pay.amount, pay.type, sale_id)
        cur.execute(sql_raw_add_paid, data)
        cur.connection.commit() # trick :)

    cur.execute(sql_raw_paid, (sale_id,))
    paids = cur.fetchall()
    sale_paids = []
    for p in paids:
        paid = models.SalePaid()
        paid.id = p['paid_id']
        paid.amount = p['paid_amount']
        paid.type = p['paid_type']
        paid.date_create = p['paid_date_create']
        sale_paids.append(paid)

    return {'sale_id': sale_id, 'paids': sale_paids}


def cancel_sale(sale_id: int,  db: Session, query: Query):
    sql_raw_sale_return = query.UPDATE_SALES_AS_RETURN
    cur = get_cursor(db)
    cur.execute(sql_raw_sale_return, (sale_id,))
    cur.connection.commit()
    return {'sale_id': sale_id}


def selected_store(name: str, db:Session, query:Query):
    sql_raw = query.SELECTED_STORE
    cur = get_cursor(db)
    data = (name, )
    cur.execute(sql_raw, data)
    s = cur.fetchall()

    store_id: int = 0

    if len(s) > 0:
        store_id: str = s[0]['store_id']

    return store_id


def get_next_sequence(code: str, db: Session, query: Query):
    sql_raw_update_seq = query.UPDATE_SEQUENCE
    cur = get_cursor(db)
    data = (code, )
    cur.execute(sql_raw_update_seq, data)
    cur.connection.commit()

    sql_seq = query.SELECT_SEQ
    cur = get_cursor(db)
    cur.execute(sql_seq, data)
    s = cur.fetchall()

    prefix: str = None
    fill: int = 0
    current_seq: int = 0

    if len(s) > 0:
        prefix: str = s[0]['prefix']
        fill: int = s[0]['fill']
        current_seq: int = s[0]['current_seq']

    return f"{prefix.ljust(fill, '0')}{current_seq}"


def add_sale(transaction: dict,  db: Session, query: Query):
    sql_raw_insert_sale: str = query.INSERT_SALE
    cur = get_cursor(db)
    TWO_DECIMAL: int = 2 

    amount: float = round(transaction['sale_detail']['gran_total'], TWO_DECIMAL)
    sub: float = round(transaction['sale_detail']['sub_total'], TWO_DECIMAL)
    discount: float = round(transaction['sale_detail']['discount_total'], TWO_DECIMAL)
    tax_amount: float = round(transaction['sale_detail']['sub_tax'], TWO_DECIMAL)
    delivery_charge: float = 0.0

    sequence_type: str = transaction['sequence_type']
    status: str = transaction['status']
    sale_type: str = transaction['sale_type']

    sequence: str = get_next_sequence(code=sequence_type, db=db, query=query)

    login: str = transaction['user']['username']
    client_id: int = transaction['client']['id']
    store_name: str = transaction['user']['selectedStore']
    store_id: int = selected_store(store_name, db, query)
    additional_info: str = transaction['additional_info']

    data = (amount, sub, discount, tax_amount, delivery_charge, sequence, sequence_type, status, sale_type, login, client_id, store_id, additional_info)
    cur.execute(sql_raw_insert_sale, data)
    cur.connection.commit()
    sale_id = cur.lastrowid

    sql_upd_inv = query.UPDATE_INV_ON_SALE
    sql_raw_insert_sale_line = query.INSERT_SALE_LINE

    for p in transaction['products']:
        amount: float = round(p['price'], TWO_DECIMAL)
        total_amount: float = round(p['price_for_sale'], TWO_DECIMAL)
        try:
            discount: float = round(p['discount'], TWO_DECIMAL)
        except Exception as ex:
            discount: float = 0.0
        qty_for_sale: int = p['inventory'][0]['quantity_for_sale']
        product_id: int = p['id']

        data = (amount, 0, discount, qty_for_sale, total_amount, sale_id, product_id)
        cur.execute(sql_raw_insert_sale_line, data)
        cur.connection.commit()

        # lower product from app_inventory
        data = (qty_for_sale, product_id, store_id)
        cur.execute(sql_upd_inv, data)
        cur.connection.commit()


    paids = []
    if status != "CREDIT":
        for p in transaction['paids']:
            paid = SalePaid()
            paid.amount = p['amount']
            paid.type = p['type']
            paids.append(paid)

        add_pay(paids, sale_id, db, query)

    return True


def sequences(db:Session, query:Query):
    sql_raw = query.SELECT_SEQ_ALL
    cur = get_cursor(db)
    cur.execute(sql_raw)
    seq = cur.fetchall()

    seqlist = []
    for s in seq:
        q = Sequence()
        q.id = s['id']
        q.name = s['name']
        q.code = s['code']
        q.prefix = s['prefix']
        q.fill = s['fill']
        q.increment_by = s['increment_by']
        q.current_seq = s['current_seq']
        seqlist.append(q)

    return seqlist

