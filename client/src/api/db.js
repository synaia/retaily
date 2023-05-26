import Dexie from 'dexie';

export const db = new Dexie('retail.db');

const VERSION = 1;

//-----------------------------
//    table: users
//-----------------------------
db.version(VERSION).stores({
  users: '++id, username, token, scopes, stores, pic, dateupdate',
  preferences: '++id, preference_name, value'
});


export const persistUser = async (user, username) => {
  const freshuser = {
    'username': username,
	  'token': user.access_token,
    'scopes': user.scopes,
    'stores': user.stores,
    'pic': user.pic,
    'dateupdate': user.dateupdate
	};

  const count = await db.users.where({'username': username}).modify(freshuser);
  
  if (count == 0) {
    await db.users.add(freshuser);
  }

  console.log('USER REFRESH .... ', freshuser);
}

export const getCurrentUser = async () => {
  const current = await db.users.where({'id': 1}).first();
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

export const getPreference = async (pref) => {
  const pref_value = await db.preferences.where({'preference_name': pref}).first();
  return pref_value;
}
