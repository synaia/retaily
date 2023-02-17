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
  and p.image_raw is not null
  ;

--OTHER
SELECT * FROM app_store;