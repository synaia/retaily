import Dexie from 'dexie';

export const db = new Dexie('retail.db');

const VERSION = 1;

//-----------------------------
//    table: users
//-----------------------------
db.version(VERSION).stores({
  users: '++id, username, token, scopes, stores, pic, dateupdate, selectedStore',
  preferences: '++id, preference_name, value'
});


export const persistUser = async (user) => {
  const freshuser = {
    'username': user.username,
    'first_name': user.first_name,
	  'token': user.access_token,
    'scopes': user.scopes,
    'stores': user.stores,
    'pic': user.pic,
    'dateupdate': new Date(user.dateupdate),
    'selectedStore': user.selectedStore
	};

  const count = await db.users.where({'username': user.username}).modify(freshuser);
  
  if (count == 0) {
    await db.users.add(freshuser);
  }

  console.log('USER REFRESH .... ', freshuser);
  if (user.selectedStore != null && user.is_logout == null) {
    window.location.href = '/#/admin/';
  }

  if (user.is_logout != null) {
    window.location.href = '/#/admin/users/login';
  }

}

export const getCurrentUser = async (url) => {
  const current = await db.users.orderBy('dateupdate').last();
  console.log(current, url);
  return current;
}


export const persistPreference = async (pref, value) => {
  const args = {
    'preference_name': pref,
    'value': value
  }

  const count = await db.preferences.where({'preference_name': pref}).modify(args);
  
  if (count == 0) {
    await db.preferences.add(args);
  }
}

export const getPreferences = async () => {
  const values = await db.preferences.toArray();
  const prefs = values.reduce((dict, data) => {
    dict[data.preference_name] = data.value;
    return dict;
  }, {})
  return prefs;
}
