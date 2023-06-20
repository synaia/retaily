uvicorn server.main:app --host 0.0.0.0 --port 4443 \
--ssl-keyfile /home/wilton/certs/retaily.app.key \
--ssl-certfile /home/wilton/certs/1c55a1ede5e4705a.pem \
--ssl-ca-certs /home/wilton/certs/gd_bundle-g2-g1.crt \
--reload
