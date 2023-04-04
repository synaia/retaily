import requests

headers = {
    'accept': 'application/json',
    'content-type': 'application/x-www-form-urlencoded',
}

params = {
    'username': 'luis',
    'password': 'luis',
}

response = requests.post('https://127.0.0.1:8500/users/token', params=params, headers=headers, verify=False)

body = """// Generate With Python :)
export const BACKEND_HOST = 'https://localhost:8500';

// constants for test pupuses
export const TOKEN = 'TOKEN_KEY';
export const STORE = 'SAMBIL';
"""

token = [f for f in response.json().items()][0][1]
body = body.replace("TOKEN_KEY", token)

constant_js_file = open('/Users/beltre.wilton/apps/retaily/client/src/util/constants.js', "w")
constant_js_file.write(body)
constant_js_file.close()
