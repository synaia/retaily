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

--SELECT_ALL_PRODUCT
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
    p.image_raw
  FROM product  p
  ORDER BY p.id DESC
;

--SELECT_ALL_PRODUCT_BY_ID
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
    p.image_raw
  FROM product  p
  WHERE p.id = %s
;

--INSERT_PRODUCT
INSERT INTO product (name, cost, code, date_create, user_modified, image_raw)
 VALUES (%s, %s, %s, NOW(), %s, %s)
;

--INSERT_PRODUCT_INVENTORY
INSERT INTO app_inventory (quantity, product_id, store_id)
   VALUES (%s, %s, %s)
;

--INSERT_PRUDUCT_PRICING
INSERT INTO pricing_list (price, user_modified, product_id, pricing_id)
   VALUES (%s, %s, %s, %s)
;

--SELECT_PRICING_LIST
SELECT
     pl.id,
     pl.price,
     pl.user_modified,
     pl.date_create,
     p.price_key,
     p.label
FROM pricing_list pl, pricing p
  WHERE pl.pricing_id = p.id
   AND p.status = 1
   AND  pl.product_id = %s
ORDER BY pl.id
;

--SELECT_PRICING_LABELS
SELECT
    p.id,
    p.price_key,
    p.label
FROM pricing p
WHERE
   p.status = 1
;

--SELECT_PRICING
SELECT
    p.id,
	p.label,
    p.price_key,
    p.date_create,
    p.status,
    p.user_modified
FROM pricing p
;

--INSERT_PRICING
INSERT INTO pricing (label, price_key, user_modified)
  VALUES (%s, %s, %s)
;

--INSERT_PRICING_LIST
INSERT INTO pricing_list (price, user_modified, product_id, pricing_id)
    SELECT (p.price * %s), %s, p.id, %s FROM product p
;

--SELECT_SALES_BY_CLIENT
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
    cli.celphone,
    (SELECT
        SUM(paid.amount)
	   FROM sale_paid paid
      WHERE  paid.sale_id = s.id
      GROUP BY paid.sale_id
	) as total_paid,
    (SELECT
         COUNT(*)
	  FROM sale_line line
     WHERE line.sale_id = s.id
     GROUP BY line.sale_id
    ) as total_line,

	(CASE
      WHEN s.status = 'RETURN' THEN 'cancelled'
      WHEN (s.amount - (SELECT
							SUM(paid.amount)
						   FROM sale_paid paid
						  WHERE  paid.sale_id = s.id
						  GROUP BY paid.sale_id
						)) > 0 THEN 'open'
      ELSE 'close'
	 END) as invoice_status
 FROM sale s,  app_store store, client cli
WHERE s.client_id = cli.id
  AND s.store_id = store.id
  AND store.name = %s
  AND s.date_create BETWEEN %s AND %s
  AND (CASE
      WHEN s.status = 'RETURN' THEN 'cancelled'
      WHEN (s.amount - (SELECT
							SUM(paid.amount)
						   FROM sale_paid paid
						  WHERE  paid.sale_id = s.id
						  GROUP BY paid.sale_id
						)) > 0 THEN 'open'
      ELSE 'close'
	 END) in %s
  AND cli.id = %s
ORDER BY s.id DESC
;

--SELECT_SALES_BY_INVOICE_STATUS
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
    cli.celphone,
    (SELECT
        SUM(paid.amount)
	   FROM sale_paid paid
      WHERE  paid.sale_id = s.id
      GROUP BY paid.sale_id
	) as total_paid,
    (SELECT
         COUNT(*)
	  FROM sale_line line
     WHERE line.sale_id = s.id
     GROUP BY line.sale_id
    ) as total_line,

	(CASE
      WHEN s.status = 'RETURN' THEN 'cancelled'
      WHEN (s.amount - (SELECT
							SUM(paid.amount)
						   FROM sale_paid paid
						  WHERE  paid.sale_id = s.id
						  GROUP BY paid.sale_id
						)) > 0 THEN 'open'
      ELSE 'close'
	 END) as invoice_status
 FROM sale s,  app_store store, client cli
WHERE s.client_id = cli.id
  AND s.store_id = store.id
  AND store.name = %s
   AND s.date_create BETWEEN %s AND %s
  AND (CASE
      WHEN s.status = 'RETURN' THEN 'cancelled'
      WHEN (s.amount - (SELECT
							SUM(paid.amount)
						   FROM sale_paid paid
						  WHERE  paid.sale_id = s.id
						  GROUP BY paid.sale_id
						)) > 0 THEN 'open'
      ELSE 'close'
	 END) in %s
ORDER BY s.id DESC
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

--SELECT_PAID
SELECT
	sp.id as paid_id,
    sp.amount as paid_amount,
    sp.type as paid_type,
    sp.date_create as paid_date_create
FROM sale_paid sp
WHERE sp.sale_id = %s
;

--INSERT_PAID
INSERT INTO sale_paid(amount, type, sale_id, date_create)
   VALUES(%s, %s, %s, NOW())
;

--UPDATE_SALES_AS_RETURN
UPDATE sale
  SET status = 'RETURN'
WHERE id = %s
;

--SELECT_STORES
 SELECT
      s.id,
      s.name
FROM app_store s
;

--SELECT_PRODUCT_INV
 SELECT
      i.id,
      i.prev_quantity,
      i.quantity,
      i.next_quantity,
      st.name,
      st.id as store_id
 FROM app_inventory i, app_store st
  WHERE i.store_id = st.id
   AND  i.product_id = %s
   AND  st.name = %s
;

--SELECT_INVENTORY_HEAD
SELECT
	h.id,
    h.name,
    h.date_create,
    h.date_close,
    h.status,
    h.memo,
    st.id as store_id,
    st.name as store_name
 FROM app_inventory_head h, app_store st
	WHERE h.store_id = st.id
	AND st.name = %s
;

--INSERT_INVENTORY_HEAD
INSERT INTO app_inventory_head (name, memo, store_id)
 VALUES (%s, %s, %s)
;

--UPDATE_INVENTORY_NEXT
UPDATE
     app_inventory
  SET
     next_quantity = %s
  WHERE
        product_id = %s
   AND  store_id = %s
;