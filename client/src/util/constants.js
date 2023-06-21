export const BACKEND_HOST = import.meta.env.SNOWPACK_PUBLIC_BACKEND_HOST;
export const BACKEND_HOST_WWS = import.meta.env.SNOWPACK_PUBLIC_BACKEND_HOST_WWS;
export const SELF_HOST = import.meta.env.SNOWPACK_PUBLIC_BACKEND_HOST;


export const SCOPES = {
   DASHBOARD: {
    VIEW: 'dashboard.view'
   },
   SALES: {
    POS: 'sales.pos',
    POS_VELIVERY: 'pos.delivery',
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
    VIEW_ACTIVE_COLUMN: 'product.view.active_column',
   }
}
