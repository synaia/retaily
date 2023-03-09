# from http.server import HTTPServer, BaseHTTPRequestHandler
# import ssl
#
#
# httpd = HTTPServer(('10.0.0.6', 4443), BaseHTTPRequestHandler)
#
# httpd.socket = ssl.wrap_socket (httpd.socket,
#         keyfile="/Users/beltre.wilton/apps/retaily/client/snowpack.key",
#         certfile='/Users/beltre.wilton/apps/retaily/client/snowpack.crt', server_side=True)
#
# httpd.serve_forever()

import http.server
import ssl

server_address = ('localhost', 4443)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket,
                               server_side=True,
                               certfile="/Users/beltre.wilton/apps/retaily/client/snowpack.crt",
                               keyfile="/Users/beltre.wilton/apps/retaily/client/snowpack.key",
                               ssl_version=ssl.PROTOCOL_TLS)
httpd.serve_forever()
