import React from "react";
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { useDispatch , useSelector} from "react-redux";

export const Products = () => {
    const products = useSelector((state) => state.product.products);

    const columns = [
        { key: 'id', name: 'ID' },
        { key: 'name', name: 'Product' },
        { key: 'cost', name: 'Cost' },
        { key: 'price', name: 'Price' },
        { key: 'code', name: 'SKU' },
        { key: 'quantity', name: 'QTY' },
      ];
    let rows = [];
    products.forEach(product => {
        let row = {
            'id': product.id,
            'name': product.name,
            'cost': product.cost,
            'price': product.price,
            'code': product.code,
            'quantity': product.inventory.quantity,
        };
        rows.push(row)
    });

    const rowKeyGetter = (row) => {
        return row.id;
    };

    return (
        <DataGrid columns={columns} rows={rows} rowKeyGetter={rowKeyGetter} />
    )
};