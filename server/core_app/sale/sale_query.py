from sqlalchemy.orm import Session
import server.core_app.sale.sale_models as models
from server.core_app.client.client_models import Client
from server.core_app.product.product_models import Product
from server.core_app.dbfs.Query import Query
from server.core_app.database import get_cursor


def read_sales(init_date: str, end_date: str, store: str, db: Session, query: Query):
    sql_raw = query.SELECT_SALES
    sql_raw_paid = query.SELECT_PAID
    sql_raw_line = query.SELECT_LINE

    cur = get_cursor(db)
    cur.execute(sql_raw, (store, init_date, end_date)) # test calling child tables.
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
        sale.total_paid = 0 if (rp['total_paid'] is None) else rp['total_paid']
        sale.due_balance = rp['amount'] - sale.total_paid

        if 'RETURN' == sale.status:
            invoice_status = 'canceled'
        elif sale.due_balance > 0:
            invoice_status = 'open'
        else:
            invoice_status = 'close'

        sale.invoice_status = invoice_status
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
