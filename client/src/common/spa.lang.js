export  const lang = {
    pos: {
        pos: 'Punto de Ventas',
        find_client: 'Buscar un cliente ...',
        sub: 'Sub Total:',
        total: 'Total:',
        delivery: 'Delivery:',
        discount: 'Descuento:',
        tax: 'ITBIS',
        discardsale: 'Esta seguro que quiere descartar?',
        client: {
            header: 'Localiza Clientes',
            name: 'Nombre',
            doc: 'Cédula',
            phone: 'Teléfono',
            address: 'Dirección',
            email: "Correo",
            save: "Guardar Cliente",
            update: "Actualizar Cliente",
        },
        payment: {
            invoice_to: 'Facturar a:',
            cash: 'Efectivo',
            credit: 'Crédito',
            in_store: 'Venta en Tienda',
            for_deliver: 'Venta Delivery',
            cc: 'Tarjeta créd/déb',
            add_info: 'Nota adicional ...',
            _return: 'regresar'
        }
    },
    menu: {
        dashboard: 'Resumen',
        pos: 'POS',
        sales: 'Ventas',
        inventory: 'Inventario',
        users: 'Usuarios',
        reports: 'Reportes',
        analytics: 'Analíticas',
        messages: 'Mensajes',
        settings: 'Configuración',
        add_product: 'Agregar producto',
        logout: 'Salir',
        products: 'Productos',
        pricelist: 'Lista de Precios',
        storelist: 'Almacenes',
        store_fix_quantity: 'Manejo de Inventario',
        request_store_mov_list: 'Lista de Movimiento entre Almacenes',
        request_store_mov: 'Solicitud Movimiento entre Almacenes',
        response_store_mov_list: 'Solicitudes de Movimiento entre Almacenes',
        response_store_mov: 'Recibir Movimiento de Almacén',
        request_purchase_list: 'Lista de Ordenes de Compra',
        request_purchase: 'Hacer Orden de Compra',
        response_purchase_list: 'Lista de Ordenes de Compra a Recibir',
        response_purchase: 'Recibir Orden de Compra',
        bulk_order: 'Procesar Importación/Compras',
        bulk_order_new: 'Nuevo elemento para agrupar Ordenes de Compra',
    },
    sale: {
        all: 'Todo',
        open: 'Abiertas',
        close: 'Cerradas',
        cancelled: 'Canceladas',
        sales_analytics: 'Analítica de Ventas',
        total_sales: 'Ventas Totales',
        close_invoices: 'Facturas Cerradas',
        due_balances: 'Balance Pendiente',
        product: 'Producto',
        sub: 'Sub Total',
        amount: 'Monto',
        type: 'Tipo',
        in_date: 'Fecha',
        user: 'Usuario',
        re_print: 'Re-Imprimir Factura',
        cancel: 'Cancelar Factura'
    },
    products: {
        active: 'Activo',
        name: 'Producto',
        cost: 'Costo',
        quantity: 'Solicitado',
        quantity_in_store: 'Cantidad',
        new_quantity: 'Cantidad Correcta',
        available_quantity: 'Disponible',
        received_quantity: 'Cantidad Recibida',
        move_quantity: 'a Mover',
        approbal: 'Aprobar',
        quantity_abbr: 'Cant.',
        quantity_rec_abbr: 'Cant. Recibida',
    },
    pricelist: {
        label: 'Etiqueta',
        key: 'Código',
        percent: 'Porciento',
        create: 'Crear Lista de Precios',
        _date: 'Fecha',
        status: 'Estado'
    },
    newproduct: {
        name: 'Nombre',
        cost: 'Costo',
        code: 'Código',
        inventory: 'Inventario',
        pricing: 'Precios',
        create: 'Crear Producto',
        take: 'Usar foto local',
        connect: 'Conectar al Celular'
    },
    store: {
        name: 'Nombre del Almacén',
        create: 'Crear Nuevo Almacén',
        value_inventory: 'Valor Costo en Inventario',
        in_progress: 'En Progreso',
        status: 'Estado',
        product_changed: 'Productos con Cambios',
        value_changed: 'Valor en el Cambio',
        changed_count: 'Cantidad',
        inventory_name: 'Nombre Inventario',
        change_count: 'Total',
        days: 'Dias abierto',
        open_inventory: 'Abrir Inventario Nuevo',
        close_inventory: 'Finalizar Inventario en Progreso',
        cancel_inventory: 'Cancelar Inventario sin Efecto'
    },

    storemov: {
        from_store: 'Desde Almacén',
        to_store: 'Para Almacén',
        open_mov: 'Hacer Movimiento',
        status: 'Estatus de la Orden',
        name: 'Nombre',
        value_mov: 'Valor en Costo',
        product_in_order: 'Productos en orden',
        issues: 'Problemas',
        date_open: 'Fecha',
        date_close: 'Fecha Cierre',
        user_open: 'Usuario',
        user_close: 'Usuario Cierra',
        select_store: 'Seleccione Almacén',
        products_found: 'Productos encontrados',
        products_total: 'total de productos',
        cancel_rollback: 'Cancelar TODA la Orden'
    },
    purchase: {
        from_provider: 'Desde Proveedor',
        select_provider: 'Selecciona un Proveedor',
        to_store: 'Para Almacén',
        open: 'Iniciar Nueva Orden de Compra',
        bulk_name: 'Conjunto de Compras',
        name: 'Order',
        select_bulk: 'Selecciona el Conjunto de Compras',
        purchase_quantity: 'a Comprar',
        order_not_editable: 'Order no editable, fue cerrada.'
    },
    dashboard: {
        total_sales: 'Ventas Totales',
        total_due: 'Pendiente por cobro',
        total_income: 'Ganancias',
        on_the_running_day: 'En lo que va del día',

    },
    messages: {
        ORDER_PRODUCT_LINE: 'NUEVOS CAMBIO DE PRODUCTOS EN EL MOVIMIENTO',
        ORDER_CANCELLED: 'LA ORDEN FUE CANCELADA',
        ORDER_PROCESSED: 'LA ORDEN FUE PROCESADA',
        ORDER_APPROBAL: 'EL CAMBIO DE CANTIDAD FUE APROBADO',
        ORDER_ISSUE: 'EL SIGUIENTE PRODUCTO TIENE OBSERVACIONES',
        ORDER_NEW: 'UNA NUEVA ORDEN HA SIDO CREADA',
        new_messages: (num) => `Tiene ${num} Nuevos Mensajes`,
    }
}