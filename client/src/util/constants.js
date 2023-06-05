// Generate With Python :)
export const BACKEND_HOST = 'https://localhost:8500';

// constants for test pupuses
// export const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsdWlzIiwic2NvcGVzIjpbInNhbGVzIiwiZGFzaGJvYXJkLnZpZXciLCJzYWxlcy5wb3MiLCJzYWxlcy52aWV3IiwiaW52ZW50b3J5LnZpZXciLCJpbnZlbnRvcnkuc3RvcmVzIiwiaW52ZW50b3J5LmJ1bGsiLCJpbnZlbnRvcnkubW92ZW1lbnQucmVxdWVzdCIsImludmVudG9yeS5tb3ZlbWVudC5yZXNwb25zZSIsImludmVudG9yeS5wdXJjaGFzZS5yZXF1ZXN0IiwiaW52ZW50b3J5LnB1cmNoYXNlLnJlc3BvbnNlIiwidXNlci52aWV3IiwidXNlci5zZXR0aW5nIiwicmVwb3J0LnZpZXciLCJhbmFsaXR5Yy52aWV3IiwicHJvZHVjdC5hZGQiLCJwcm9kdWN0LnZpZXciLCJwcm9kdWN0LnByaWNlbGlzdCIsInByb2R1Y3Qudmlldy5jb3N0Il0sInN0b3JlcyI6WyJNQURFTFRBIiwiU0FNQklMIl0sImlzX2FjdGl2ZSI6MSwiZXhwIjoxNjg1MDI1MjA3fQ.MAUrmV7R4XN1wwVlaD_spAHTdeixydKrE-OnjKQyCdk';
// export const STORE = 'SAMBIL';

export const SCOPES = {
   DASHBOARD: {
    VIEW: 'dashboard.view'
   },
   SALES: {
    POS: 'sales.pos',
    VIEW: 'sales.view',
    FILTER: {
        USER: 'sales.filter.user',
        STORE: 'sales.filter.store'
    }
   },
   INVENTORY: {
    VIEW: 'inventory.view',
    STORES: 'inventory.stores',
    BULK: 'inventory.bulk',
    MOVEMENT: {
        REQUEST: 'inventory.movement.request',
        RESPONSE: 'inventory.movement.response',
    },
    PURCHASE: {
        REQUEST: 'inventory.purchase.request',
        RESPONSE: 'inventory.purchase.response',
    }
   },
   USER: {
    VIEW: 'user.view',
    SETTING: 'user.setting',
   },
   REPORT: {
    VIEW: 'report.view',
   },
   ANALYTIC: {
    VIEW: 'analityc.view',
   },
   PRODUCT: {
    ADD: 'product.add',
    VIEW: 'product.view',
    EDIT: 'product.edit',
    PRICELIST: 'product.pricelist',
    VIEWCOST: 'product.view.cost',
   }
}
