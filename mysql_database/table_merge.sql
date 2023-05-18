USE retaily_db;

CREATE TABLE sambil_db__client AS
SELECT
      c.id, (c.id + 12000) AS new_id, c.name, c.document_id, c.address, c.celphone,
      c.email, c.date_create, c.wholesaler
 FROM sambil_db.client c
  WHERE c.id > 1
 ORDER BY c.id;

SET GLOBAL log_bin_trust_function_creators = 1;
DELIMITER //
DROP FUNCTION IF EXISTS GET_MIN_PRODUCT_ID //
CREATE FUNCTION GET_MIN_PRODUCT_ID (in_id BIGINT) RETURNS BIGINT
BEGIN
   DECLARE PRODUCT_ID BIGINT;
   DECLARE IN_CODE VARCHAR(40);
   SELECT z.code INTO IN_CODE
        FROM sambil_db.product z WHERE z.id = in_id;
   SELECT MIN(x.id) INTO PRODUCT_ID
      FROM madelta_db.product x
         WHERE TRIM(x.code) = TRIM(IN_CODE) AND LENGTH(IN_CODE) > 4;
   IF ISNULL(PRODUCT_ID) THEN
	SET PRODUCT_ID = in_id + 10000;
   END IF;
 RETURN PRODUCT_ID;
END;
//
DELIMITER ;

-- SELECT GET_MIN_PRODUCT_ID(1000);

-- SELECT *  FROM madelta_db.product x WHERE TRIM(x.code) = TRIM('631656710472') AND LENGTH('631656710472') > 4;

-- DROP TABLE sambil_db__product;
CREATE TABLE sambil_db__product AS
SELECT
    p.id,
    GET_MIN_PRODUCT_ID(p.id) as new_product_id,
    p.name, p.cost,
    p.price, p.margin, p.quantity, p.code,
    p.img_path, p.date_create, p.image_raw, p.active
FROM sambil_db.product p
--  WHERE p.active = 1
ORDER BY p.id;
-- 8644 = 18644
-- 8696 = 8008
-- 8702 = 8720
-- 8681 = 7771
-- SELECT
-- 	p.id, new_product_id,
--     p.name, p.code,
--     (SELECT x.name FROM madelta_db.product x WHERE x.id = p.new_product_id) AS min_name,
--     (SELECT x.code FROM madelta_db.product x WHERE x.id = p.new_product_id) AS min_code,
--     p.price, p.margin, p.quantity, p.cost,
--     p.date_create, p.active
-- FROM sambil_db__product p
--   WHERE p.id in (8644, 8696, 8702, 8681)
-- ;

-- DROP TABLE sambil_db__product;
-- CREATE TABLE sambil_db__product AS
-- SELECT
--     p.id, (p.id + 10000) as new_product_id, p.name, p.cost, p.price, p.margin, p.quantity, p.code, p.img_path, p.date_create, p.image_raw, p.active
-- FROM sambil_db.product p
-- ORDER BY p.id;

CREATE TABLE sambil_db__sale AS
SELECT
     s.id, (s.id * 10) as new_id, s.amount, s.sub, s.discount, s.tax_amount,
     s.delivery_charge, s.sequence, s.sequence_type,
     s.status, s.sale_type, s.date_create, s.login, s.client_id, (s.client_id + 12000) AS new_client_id
  FROM  sambil_db.sale s
ORDER BY s.id
;

CREATE TABLE sambil_db__sale_line AS
SELECT
      l.id, (l.id + 100000) as new_id,  l.amount, l.tax_amount, l.discount, l.quantity,
      l.total_amount, l.sale_id, (l.sale_id * 10) AS new_sale_id, l.product_id, GET_MIN_PRODUCT_ID(l.product_id) as new_product_id
FROM sambil_db.sale_line l
ORDER BY l.id;

CREATE TABLE sambil_db__sale_paid AS
SELECT
	  s.id, (s.id + 50000) AS new_id, s.amount, s.type, s.date_create, s.sale_id, (s.sale_id * 10) AS new_sale_id
FROM sambil_db.sale_paid s
ORDER BY s.id ;



CREATE TABLE client AS
SELECT
     c.id, c.name, c.document_id, c.address, c.celphone,
	c.email, c.date_create, c.wholesaler
FROM madelta_db.client c
WHERE
    c.id > 1
UNION ALL
SELECT
     new_id, c.name, c.document_id, c.address, c.celphone,
	c.email, c.date_create, c.wholesaler
FROM sambil_db__client c
WHERE
    c.id >= 214
;
ALTER TABLE `retaily_db`.`client`
CHANGE COLUMN `id` `id` BIGINT NOT NULL AUTO_INCREMENT ,
ADD PRIMARY KEY (`id`);


CREATE TABLE TMP_PRODUCT AS
SELECT
    t.id,  t.name, t.cost, t.price, t.margin, t.code, t.img_path, t.date_create, t.image_raw, t.active,
    RANK() OVER (PARTITION BY t.id ORDER BY t.date_create DESC) AS rank_product_id
 FROM
(SELECT
    p.id,             p.name, p.cost, p.price, p.margin, p.code, p.img_path, p.date_create, p.image_raw, p.active
FROM madelta_db.product p
UNION ALL
SELECT
    p.new_product_id, p.name, p.cost, p.price, p.margin, p.code, p.img_path, p.date_create, p.image_raw, p.active
FROM sambil_db__product p) AS t
ORDER BY t.id;

CREATE TABLE product AS
 SELECT t.id,  t.name, t.cost, t.price, t.margin, t.code, t.img_path, t.date_create, t.image_raw, t.active
   FROM TMP_PRODUCT t
  WHERE t.rank_product_id = 1
;

ALTER TABLE `retaily_db`.`product`
CHANGE COLUMN `id` `id` BIGINT NOT NULL AUTO_INCREMENT ,
ADD PRIMARY KEY (`id`);


CREATE TABLE sale AS
SELECT
	 s.id, s.amount, s.sub, s.discount, s.tax_amount,
     s.delivery_charge, s.sequence, s.sequence_type,
     s.status, s.sale_type, s.date_create, s.login,  s.client_id, 1 as store_id
FROM
    madelta_db.sale s
UNION ALL
SELECT
	 s.new_id, s.amount, s.sub, s.discount, s.tax_amount,
     s.delivery_charge, s.sequence, s.sequence_type,
     s.status, s.sale_type, s.date_create, s.login, s.new_client_id, 2 as store_id
FROM
    sambil_db__sale s;

ALTER TABLE `retaily_db`.`sale`
CHANGE COLUMN `id` `id` BIGINT NOT NULL AUTO_INCREMENT ,
ADD PRIMARY KEY (`id`);


CREATE TABLE sale_line AS
SELECT
      l.id,  l.amount, l.tax_amount, l.discount, l.quantity,
      l.total_amount, l.sale_id,  l.product_id
FROM madelta_db.sale_line l
UNION ALL
SELECT
      l.new_id, l.amount, l.tax_amount, l.discount, l.quantity,
      l.total_amount, l.new_sale_id,  l.new_product_id
FROM sambil_db__sale_line l;

ALTER TABLE `retaily_db`.`sale_line`
CHANGE COLUMN `id` `id` BIGINT NOT NULL AUTO_INCREMENT ,
ADD PRIMARY KEY (`id`);


CREATE TABLE sale_paid AS
SELECT
	  s.id, s.amount, s.type, s.date_create, s.sale_id
FROM madelta_db.sale_paid s
UNION ALL
SELECT
	  s.new_id, s.amount, s.type, s.date_create, s.new_sale_id
FROM sambil_db__sale_paid s;

ALTER TABLE `retaily_db`.`sale_paid`
CHANGE COLUMN `id` `id` BIGINT NOT NULL AUTO_INCREMENT ,
ADD PRIMARY KEY (`id`);


CREATE TABLE app_sequence AS
 SELECT * FROM madelta_db.app_sequence;

 ALTER TABLE `retaily_db`.`app_sequence`
CHANGE COLUMN `id` `id` BIGINT NOT NULL AUTO_INCREMENT ,
ADD PRIMARY KEY (`id`);


CREATE TABLE `app_store` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `date_create` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_app_store_name` (`name`),
  KEY `ix_app_store_id` (`id`)
) ENGINE=InnoDB;

INSERT INTO app_store (`id`, `name`) VALUES (1, 'MADELTA');
INSERT INTO app_store (`id`, `name`) VALUES (2, 'SAMBIL');

-- DROP TABLE app_inventory;
CREATE TABLE `app_inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prev_quantity` int DEFAULT '0',
  `quantity` int DEFAULT NULL,
  `next_quantity` int DEFAULT '0',
  `status` varchar(10) DEFAULT 'quiet',
  `last_update` datetime DEFAULT NULL,
  `user_updated` varchar(90) DEFAULT NULL,
  `product_id` BIGINT DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `store_id` (`store_id`),
  KEY `ix_app_inventory_id` (`id`),
  CONSTRAINT `app_inventory_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `app_inventory_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `app_store` (`id`)
) ENGINE=InnoDB;

 -- INSERT INTO app_inventory (quantity, next_quantity, product_id, store_id)
--  SELECT p.quantity, p.quantity, p.id, 1 FROM madelta_db.product p WHERE p.active = 1;
--
--  INSERT INTO app_inventory (quantity, next_quantity, product_id, store_id)
--  SELECT 0, 0, p.id, 2 FROM madelta_db.product p WHERE p.active = 1;
--
--
--  INSERT INTO app_inventory (quantity, next_quantity, product_id, store_id)
--  SELECT p.quantity, p.quantity, p.new_product_id, 2 FROM sambil_db__product p WHERE p.active = 1;
--
--  INSERT INTO app_inventory (quantity, next_quantity, product_id, store_id)
--  SELECT 0, 0, p.new_product_id, 1 FROM sambil_db__product p WHERE p.active = 1;


CREATE TABLE `app_inventory_head` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(90) DEFAULT NULL,
  `date_create` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_close` datetime DEFAULT NULL,
  `status` int DEFAULT '0',
  `memo` varchar(500) DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `store_id_inv_head_fk_idx` (`store_id`),
  CONSTRAINT `store_id_inv_head_fk` FOREIGN KEY (`store_id`) REFERENCES `app_store` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `app_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `first_name` varchar(20) DEFAULT NULL,
  `last_name` varchar(30) DEFAULT NULL,
  `is_active` int DEFAULT NULL,
  `date_joined` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_app_users_username` (`username`),
  KEY `ix_app_users_id` (`id`)
) ENGINE=InnoDB;

INSERT app_users
SELECT * FROM evofit_sambil.app_users;

CREATE TABLE `app_user_store` (
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`store_id`),
  KEY `store_id_fk_idx` (`store_id`),
  CONSTRAINT `store_id_fk` FOREIGN KEY (`store_id`) REFERENCES `app_store` (`id`),
  CONSTRAINT `user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB;

INSERT INTO app_user_store(user_id, store_id) VALUES (5, 1);
INSERT INTO app_user_store(user_id, store_id) VALUES (5, 2);
INSERT INTO app_user_store(user_id, store_id) VALUES (7, 1);
INSERT INTO app_user_store(user_id, store_id) VALUES (7, 2);

CREATE TABLE `product_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(90) DEFAULT NULL,
  `memo` varchar(500) DEFAULT NULL,
  `order_type` varchar(45) DEFAULT NULL,
  `user_requester` varchar(45) DEFAULT NULL,
  `user_receiver` varchar(45) DEFAULT NULL,
  `date_opened` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_closed` datetime DEFAULT NULL,
  `from_origin_id` int DEFAULT NULL,
  `to_store_id` int DEFAULT NULL,
  `status` varchar(45) DEFAULT 'opened',
  PRIMARY KEY (`id`),
  KEY `to_store_id_fk_order_idx` (`to_store_id`),
  CONSTRAINT `to_store_id_fk_order` FOREIGN KEY (`to_store_id`) REFERENCES `app_store` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `product_order_line` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT DEFAULT NULL,
  `from_origin_id` int DEFAULT NULL,
  `to_store_id` int DEFAULT NULL,
  `product_order_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `quantity_observed` int DEFAULT NULL,
  `status` varchar(10) DEFAULT 'pending',
  `date_create` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_receiver` varchar(45) DEFAULT NULL,
  `receiver_last_update` datetime DEFAULT NULL,
  `receiver_memo` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mov_product_id_fk_idx` (`product_id`),
  KEY `move_to_store_id_fk_idx` (`to_store_id`),
  KEY `product_order_id_fk_idx` (`product_order_id`),
  CONSTRAINT `mov_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `move_to_store_id_fk` FOREIGN KEY (`to_store_id`) REFERENCES `app_store` (`id`),
  CONSTRAINT `product_order_id_fk` FOREIGN KEY (`product_order_id`) REFERENCES `product_order` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `bulk_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `memo` varchar(500) DEFAULT NULL,
  `date_create` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_create` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `bulk_order_line` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bulk_order_id` int DEFAULT NULL,
  `product_order_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bulk_order_id_fk_idx` (`bulk_order_id`),
  KEY `oder_bulk_id_fk_idx` (`product_order_id`),
  CONSTRAINT `bulk_order_id_fk` FOREIGN KEY (`bulk_order_id`) REFERENCES `bulk_order` (`id`),
  CONSTRAINT `oder_bulk_id_fk` FOREIGN KEY (`product_order_id`) REFERENCES `product_order` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `pricing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(90) NOT NULL,
  `user_modified` varchar(90) DEFAULT NULL,
  `date_create` datetime DEFAULT CURRENT_TIMESTAMP,
  `price_key` varchar(45) NOT NULL,
  `status` int DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`label`),
  UNIQUE KEY `price_key_UNIQUE` (`price_key`)
) ENGINE=InnoDB;

CREATE TABLE `pricing_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` double DEFAULT NULL,
  `user_modified` varchar(90) DEFAULT NULL,
  `date_create` datetime DEFAULT CURRENT_TIMESTAMP,
  `product_id` BIGINT DEFAULT NULL,
  `pricing_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prod_idx` (`product_id`),
  KEY `pricing_id_fk_idx` (`pricing_id`),
  CONSTRAINT `pricing_id_fk` FOREIGN KEY (`pricing_id`) REFERENCES `pricing` (`id`),
  CONSTRAINT `product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB;


INSERT INTO pricing(label, user_modified, date_create, price_key, status)
 VALUES ('Price (Default)', 'SYSTEM', NOW(), 'DEFAULT', 1);

INSERT INTO pricing_list (price, user_modified, product_id, pricing_id)
SELECT p.price, 'SYSTEM', p.id, 1 FROM product p;


CREATE TABLE `provider` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `date_create` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_app_store_name` (`name`),
  KEY `ix_app_store_id` (`id`)
) ENGINE=InnoDB;

INSERT INTO provider
SELECT * FROM evofit_sambil.provider;

CREATE TABLE `scopes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `ix_scopes_id` (`id`),
  CONSTRAINT `scopes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB;

INSERT INTO scopes
SELECT * FROM evofit_sambil.scopes;


-- select * from app_inventory where product_id = 9052;

-- SELECT
--       i.quantity, p.name, p.cost, p.active
-- FROM app_inventory i, product p
-- WHERE i.store_id = 1
-- AND p.id = i.product_id;

-- select FORMAT(SUM(cost * quantity), 2) costo_inventario
--    from madelta_db.product
--    where active = 1
--      and quantity > 0;

-- select FORMAT(SUM(p.cost * i.quantity), 2) costo_inventario
--    from product p, app_inventory i
--    where
-- 		  p.id = i.product_id
-- 	 and  i.store_id = 1
--      and  p.active = 1
--      and quantity > 0;

INSERT INTO app_inventory (quantity, next_quantity, product_id, store_id)
 SELECT p.quantity, p.quantity, p.id, 1 FROM madelta_db.product p ;

 INSERT INTO app_inventory (quantity, next_quantity, product_id, store_id)
 SELECT 0, 0, p.id, 2  FROM madelta_db.product p
	 WHERE p.id NOT IN (
			 SELECT m.id
			  FROM madelta_db.product m, sambil_db__product s
			  WHERE
				 m.id = s.new_product_id
	)
    ;


 INSERT INTO app_inventory (quantity, next_quantity, product_id, store_id)
 SELECT p.quantity, p.quantity, p.new_product_id, 2 FROM sambil_db__product p ;

 INSERT INTO app_inventory (quantity, next_quantity, product_id, store_id)
 SELECT 0, 0, p.new_product_id, 1 FROM sambil_db__product p
	 WHERE p.new_product_id NOT IN (
			 SELECT m.id
			  FROM madelta_db.product m, sambil_db__product s
			  WHERE
				 m.id = s.new_product_id
	);

DELETE FROM app_inventory WHERE id IN (4321, 4480, 4481, 4482, 4169, 4477, 4468);



-- -- 8936
SELECT p.id, count(*) FROM product p, app_inventory i
 WHERE
      p.id = i.product_id
  -- and p.active = 1
  -- and i.quantity > 0
   and i.store_id = 2
	GROUP BY p.id
    HAVING COUNT(p.id) > 1
;
-- -- -- --
SELECT * FROM app_inventory WHERE product_id = 8787 and store_id = 2;

-- SELECT * FROM sambil_db__product WHERE new_product_id = 7888;
-- SELECT * FROM product WHERE id = 7888;
--
--  select id, name, cost, quantity, active  from sambil_db.product
--   where active = 1
--      and quantity > 0
--  order by id;


-- select id, name, code from product
--  where active = 1
--   order by code
--  ;

-- UPDATE sale_line s, product p
--    SET s.product_id = (SELECT MIN(p.id) FROM product p WHERE TRIM(p.code) = TRIM(p.code))
-- WHERE
--     s.product_id = p.id
-- AND LENGTH(p.code) > 4
-- AND s.id > 0
-- ;

-- UPDATE app_inventory i, product p
--    SET i.product_id = (SELECT MIN(p.id) FROM product p WHERE TRIM(p.code) = TRIM(p.code))
-- WHERE
--     i.product_id = p.id
-- AND LENGTH(p.code) > 4
-- AND i.id > 0
-- ;

-- UPDATE pricing_list i, product p
--    SET i.product_id = (SELECT MIN(p.id) FROM product p WHERE TRIM(p.code) = TRIM(p.code))
-- WHERE
--     i.product_id = p.id
-- AND LENGTH(p.code) > 4
-- AND i.id > 0
-- ;

-- DELETE FROM product p
--   WHERE p.id = (SELECT t.max_id FROM (SELECT MAX(i.id) as max_id FROM product i WHERE TRIM(i.code) = TRIM(p.code)) AS t)
-- 	AND LENGTH(p.code) > 4
-- 	AND p.id > 0
--  ;

 -- SELECT p.id, p.name, p.code, p.active FROM product p ORDER BY p.code ;


-- SELECT t.max_id FROM (SELECT MAX(i.id) as max_id FROM product i WHERE TRIM(i.code) = TRIM('631656710472')) AS t;

-- SELECT * FROM product p WHERE TRIM(p.code) = TRIM('631656710472');

 -- select * from sale_line where product_id = 19076;

 -- SELECT i.*, (SELECT MIN(p.id) FROM product p WHERE TRIM(p.code) = TRIM(x.code) AND LENGTH(p.code) > 4) as x_product_id
--    FROM app_inventory i, product x
--   where i.store_id = 2
--   AND i.product_id = x.id
--   ORDER BY i.product_id;
--
--   select *  from product where id = 7342;
