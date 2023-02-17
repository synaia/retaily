import Dexie from 'dexie';

export const db = new Dexie('retail.db');

db.version(1).stores({
  product: 'id, name',
});
