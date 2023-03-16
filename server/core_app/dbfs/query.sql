--SELECT_PRODUCT
SELECT
    p.id,
    p.name,
    p.cost,
    p.price,
    p.margin,
    p.code,
    p.img_path,
    p.date_create,
    p.active,
    p.image_raw,
    i.quantity,
    s.name as store_name
  FROM product  p, app_inventory i, app_store s
WHERE
      p.id = i.product_id
  and s.id = i.store_id
  and s.name = %s
  ;

--SELECT_SALES
SELECT
	s.id,
    s.amount,
    s.sub,
    s.discount,
    s.tax_amount,
    s.delivery_charge,
    s.sequence,
    s.sequence_type,
    s.status,
    s.sale_type,
    s.date_create,
    s.login,
    cli.id as client_id,
    cli.name as client_name,
    cli.document_id,
    cli.celphone
 FROM sale s,  app_store store, client cli
WHERE s.client_id = cli.id
  AND s.store_id = store.id
  AND store.name = %s
  AND s.date_create BETWEEN %s AND %s
ORDER BY s.id DESC
;

--SELECT_PAID
SELECT
	sp.id as paid_id,
    sp.amount as paid_amount,
    sp.type as paid_type,
    sp.date_create as paid_date_create
FROM sale_paid sp
WHERE sp.sale_id = %s
;

--SELECT_LINE
SELECT
	sl.amount as line_amount,
    sl.tax_amount as line_tax_amount,
    sl.discount as line_discount,
    sl.quantity,
    sl.total_amount,
	p.id as product_id,
    p.name as product_name,
    p.cost as product_cost,
    p.price as product_price,
    p.active
FROM sale_line sl, product p
WHERE sl.product_id = p.id
  AND sl.sale_id = %s;
;