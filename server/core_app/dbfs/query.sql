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
 ORDER BY s.id
;

--SELECT_INV_HEAD
SELECT
     i.id,
     i.name,
     i.date_create,
     i.date_close,
     i.status,
     i.memo
FROM
    app_inventory_head i
WHERE
    i.store_id = %s
AND i.status = 0
;


--SELECT_PRODUCT_INV
 SELECT
      i.id,
      i.prev_quantity,
      i.quantity,
      i.next_quantity,
      i.status,
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
	AND h.status = 0
;

--INSERT_INVENTORY_HEAD
INSERT INTO app_inventory_head (name, memo, store_id)
 VALUES (%s, %s, %s)
;

--PREPARE_FOR_INVENTORY
UPDATE
     app_inventory
  SET
     next_quantity = quantity,
     prev_quantity = quantity,
     status = 'waiting'
WHERE
     store_id = %s
;

--REORDER_INVENTORY
UPDATE
     app_inventory
  SET
     quantity = next_quantity,
     status = 'quiet'
WHERE
     store_id = %s
 AND status = 'changed'
;

--UPDATE_INVENTORY_NEXT
UPDATE
     app_inventory
  SET
     next_quantity = %s,
     user_updated = %s,
     last_update = NOW(),
     status = 'changed'
  WHERE
        product_id = %s
   AND  store_id = %s
;

--CLOSE_INVENTORY_HEAD
UPDATE
     app_inventory_head
SET
	 date_close = NOW(),
     status = 1
WHERE
	store_id = %s
ORDER BY date_create DESC
 LIMIT 1
;

--CLOSE_INVENTORY_HEAD_CANCEL
UPDATE
     app_inventory_head
SET
	 date_close = NOW(),
     status = 1,
     memo = CONCAT('CANCELLED: ', memo)
WHERE
	store_id = %s
ORDER BY date_create DESC
 LIMIT 1
;

--CLOSE_INVENTORY_CANCEL
UPDATE
     app_inventory
  SET
     status = 'quiet'
WHERE
     store_id = %s
 AND status = 'changed'
;

--SELECT_INV_VALUATION
SELECT
     SUM(p.cost * i.quantity) AS inv_valuation
FROM app_inventory i, app_store st, product p
 WHERE
	  st.id = i.store_id
  AND i.product_id = p.id
  AND st.name = %s
;

--SELECT_INV_VALUATION_CHANGED
SELECT
     SUM(p.cost * i.next_quantity) AS inv_valuation_changed,
     COUNT(*) AS count_inv_valuation_changed
FROM app_inventory i, app_store st, product p
 WHERE
	  st.id = i.store_id
  AND i.product_id = p.id
  AND i.status = 'changed'
  AND st.name = %s
;

--INSERT_APP_STORE
INSERT INTO app_store (name) VALUES (%s)
;

--INSERT_APP_INV_STORE
INSERT INTO app_inventory (quantity, product_id, store_id)
 SELECT 0, id, %s FROM product
;

--SELECT_FROM_PRODUCT_ORDER
SELECT
       o.id,
       o.name,
       o.memo,
       o.order_type,
       o.user_requester,
       o.user_receiver,
       o.date_opened,
       o.date_closed
 FROM  product_order o
 ORDER BY o.id
;

--SELECT_FROM_PRODUCT_ORDER_BYID
SELECT
       o.id,
       o.name,
       o.memo,
       o.order_type,
       o.user_requester,
       o.user_receiver,
       o.date_opened,
       o.date_closed
 FROM  product_order o
  WHERE o.id = %s
;

--SELECT_FROM_PRODUCT_ORDER_LINE
SELECT
       h.id,
       h.product_id,
       h.from_store_id,
       h.to_store_id,
       h.product_order_id,
       h.quantity,
       h.status,
       h.date_create,
       p.name AS product_name,
       p.cost,
       p.code,
       p.active
 FROM  product_order_line h, product p
 WHERE
        h.product_order_id = %s
   AND  h.product_id = p.id
 ORDER BY h.id DESC
;

--SELECT_FROM_PRODUCT_ORDER_LINE_BYID
SELECT
       h.id,
       h.product_id,
       h.from_store_id,
       h.to_store_id,
       h.product_order_id,
       h.quantity,
       h.status,
       h.date_create
 FROM  product_order_line h
 WHERE
     h.id = %s
;

--SELECT_FROM_PRODUCT_ORDER_LINE_BYARGS
SELECT
       h.id,
       h.quantity
 FROM  product_order_line h
 WHERE
     h.product_order_id = %s
 AND h.product_id = %s
;

--INSERT_PRODUCT_ORDER
INSERT INTO product_order (name, memo, order_type, user_requester)
  VALUES (%s, %s, %s, %s)
;

--INSERT_PRODUCT_ORDER_LINE
INSERT INTO product_order_line (product_id, from_store_id, to_store_id, product_order_id, quantity)
   VALUES (%s, %s, %s, %s, %s)
;

--VALIDATE_PRODUCT_ORDER_LINE_EXIST
SELECT
		COUNT(*) AS line_count
FROM product_order_line l
WHERE
    l.product_order_id = %s
AND l.product_id = %s
;

--UPDATE_PRODUCT_ORDER_LINE
UPDATE product_order_line
  SET quantity = %s
WHERE
	product_order_id = %s
AND product_id = %s
;

--SUBSTRACT_FROM_STORE
UPDATE app_inventory
 SET prev_quantity = quantity,
     quantity = quantity - %s,
     last_update = NOW(),
     user_updated = %s
 WHERE store_id = %s
  AND  product_id = %s
;

--SUBSTRACT_FROM_STORE_DONTTOUCH_PREV_QUANTITY
UPDATE app_inventory
 SET
     quantity = quantity - %s,
     last_update = NOW(),
     user_updated = %s
 WHERE store_id = %s
  AND  product_id = %s
;

--PROCESS_APP_INVENTORY
UPDATE app_inventory i,
  (
    SELECT l.*
	FROM product_order_line l
    WHERE
		 l.product_order_id = %s
  ) AS line
  SET
	   i.prev_quantity = i.quantity,
       i.user_updated = %s,
       i.last_update = NOW(),
	   i.quantity = i.quantity + line.quantity
 WHERE
       i.store_id = line.to_store_id
   AND i.product_id = line.product_id
;

--UPDATE_ORDER_LINE_PROCESS
UPDATE product_order_line l
  SET l.status = 'transfered'
WHERE
	l.product_order_id = %s
;

--UPDATE_PRODUCT_ORDER_PROCESS
UPDATE product_order o
   SET o.user_receiver = %s,
       o.date_closed = NOW()
WHERE
      o.id = %s
;