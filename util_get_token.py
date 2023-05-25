import requests
import socket

headers = {
    'accept': 'application/json',
    'content-type': 'application/x-www-form-urlencoded',
}

params = {
    'username': 'luis',
    'password': 'luis',
}

response = requests.post('https://127.0.0.1:8500/users/token', params=params, headers=headers, verify=False)

my_lan_ip: str = None
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    my_lan_ip = s.getsockname()[0]
    print(f'\n###### My Wifi IP ######\n######  {my_lan_ip}  ######\n')
except Exception as ex:
    print(ex)
finally:
    s.close()

body = f"""// Generate With Python :)
export const BACKEND_HOST = 'https://{my_lan_ip}:8500';

// constants for test pupuses
// export const TOKEN = 'TOKEN_KEY';
// export const STORE = 'SAMBIL';

export const SCOPES = {{
   DASHBOARD: {{
    VIEW: 'dashboard.view'
   }},
   SALES: {{
    POS: 'sales.pos',
    VIEW: 'sales.view',
   }},
   INVENTORY: {{
    VIEW: 'inventory.view',
    STORES: 'inventory.stores',
    BULK: 'inventory.bulk',
    MOVEMENT: {{
        REQUEST: 'inventory.movement.request',
        RESPONSE: 'inventory.movement.response',
    }},
    PURCHASE: {{
        REQUEST: 'inventory.purchase.request',
        RESPONSE: 'inventory.purchase.response',
    }}
   }},
   USER: {{
    VIEW: 'user.view',
    SETTING: 'user.setting',
   }},
   REPORT: {{
    VIEW: 'report.view',
   }},
   ANALYTIC: {{
    VIEW: 'analityc.view',
   }},
   PRODUCT: {{
    ADD: 'product.add',
    VIEW: 'product.view',
    PRICELIST: 'product.pricelist',
    VIEWCOST: 'product.view.cost',
   }}
}}
"""

token = [f for f in response.json().items()][0][1]
body = body.replace("TOKEN_KEY", token)

constant_js_file = open('/Users/beltre.wilton/apps/retaily/client/src/util/constants.js', "w")
constant_js_file.write(body)
constant_js_file.close()
