scp  wilton@104.236.247.241:/home/wilton/retail/pos_srv.sql .

scp  wilton@104.236.247.241:/home/wilton/retail/evofit_sambil.sql .

mysql -h localhost -u root  -p$1  -e "DROP DATABASE retaily_db"
mysql -h localhost -u root  -p$1  -e "DROP DATABASE madelta_db"
mysql -h localhost -u root  -p$1  -e "DROP DATABASE sambil_db"

mysql -h localhost -u root  -p$1  -e "CREATE DATABASE retaily_db"
mysql -h localhost -u root  -p$1  -e "CREATE DATABASE madelta_db"
mysql -h localhost -u root  -p$1  -e "CREATE DATABASE sambil_db"

mysql -h localhost -u root  -p$1  -e "GRANT ALL PRIVILEGES ON retaily_db.* TO 'wilton'@'localhost'"
mysql -h localhost -u root  -p$1  -e "GRANT ALL PRIVILEGES ON madelta_db.* TO 'wilton'@'localhost'"
mysql -h localhost -u root  -p$1  -e "GRANT ALL PRIVILEGES ON sambil_db.* TO 'wilton'@'localhost'"
mysql -h localhost -u root  -p$1  -e "flush privileges"


mysql -h localhost -u wilton sambil_db < evofit_sambil.sql -p$1

mysql -h localhost -u wilton madelta_db < pos_srv.sql -p$1

mysql -h localhost -u wilton madelta_db < table_merge.sql -p$1
