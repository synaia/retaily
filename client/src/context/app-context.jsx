import React, { createContext, useState, useEffect, useContext } from "react";
import Axios from 'axios';
import { db } from '../api/db'

export const AppContext = createContext();

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZWdhbiIsInNjb3BlcyI6WyJjeCIsInNhbGVzIiwiaHVtYW4iXSwic3RvcmVzIjpbIlNBTUJJTCJdLCJpc19hY3RpdmUiOjEsImV4cCI6MTY3Njg0NjI2OX0.RiT3xY4Ix6E_nsN2s2y0OgUALGtQZZu16E5UGTY16tw'
const store = 'SAMBIL'

export const AppContextProvider = (props) => {
    const [storeInfo, setStoreInfo] = useState({'name': 'Evofit', 'tax': 0.18});
    const [productItems, setProductItems] = useState([]);
    const [isproductsLoading, setProductLoading] = useState(true)
    const [clients, setClients] = useState([]);
    const [isclientloading, setClientloading] = useState(true)
    const [sale, setSale] = useState({'client': null, 'products': [], 'sale_detail': {'gran_total': 0, 'sub_total': 0, 'sub_tax': 0}})

    const loadProducts = async () => {
        setProductLoading(true)
        const {data: productItems} = await Axios.get('https://10.0.0.6:8500/products/', {
            headers: {
                'Authorization': `bearer ${TOKEN}`,
                'store': store
            }
        })

        setProductItems(productItems)
        setProductLoading(false)
        console.log('loadProducts: called.')
    }

    const loadClients = async () => {
        setClientloading(true)
        const {data: clients} = await Axios.get('https://10.0.0.6:8500/clients/', {
            headers: {
                'Authorization': `bearer ${TOKEN}`
            }
        });
        setClients(clients)
        setClientloading(false)
        console.log('loadClients: called.')
    }

    const postAddClient = async (client,) => {
        const {data} = await Axios.post('https://10.0.0.6:8500/clients/add', client, {
            headers: {
                'Authorization': `bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
    }

    const putUpdateClient = async (client, clientId) => {
        const {data} = await Axios.put(`https://10.0.0.6:8500/clients/update/${clientId}`, client, {
            headers: {
                'Authorization': `bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
    }

    const assigClient = (client) => {
        setSale({...sale, 'client': client});
        console.log('Cliente assigned: ', sale);
    };

    const updateTSaleDetails = (prods) => {
        const gran_total = prods.reduce((x, p) => {
            return (x + (p.price_for_sale * p.inventory.quantity_for_sale))
        }, 0)

        const sub_total = gran_total / (1 + storeInfo.tax)
        const sub_tax = sub_total * storeInfo.tax
        const sale_detail = {'gran_total': gran_total, 'sub_total': sub_total, 'sub_tax': sub_tax}
        return sale_detail
    }

    const pickProduct = (productId) => {
        console.log(productId)
        const prods = sale.products;
        const productPicked = productItems.filter( prod => prod.id == productId )[0];
        const productExist  = prods.filter( prod => prod.id == productPicked.id )[0];

        prods.forEach(prod => { prod.is_selected = 0; });

        if (productExist != undefined) {
            let index = prods.findIndex(prod => prod.id == productPicked.id);
            prods[index].inventory.quantity_for_sale += 1;
            prods[index].is_selected = 1;
        } else {
            productPicked.is_selected = 1;
            prods.push(productPicked);

            
        }

         // # clean selection by clicked
         let itemcard = Array.from(document.querySelectorAll('.product-picked'))
         itemcard.forEach(item => item.classList.remove('product-picked-selected'))


        const sale_detail = updateTSaleDetails(prods)
        
       
        setSale({...sale, 'products': prods, 'sale_detail': sale_detail});
        console.log('Product picked: ', prods);
        
      
    }

    const reduceProduct = (productId) => {
        console.log(productId)
        const prods = sale.products;
        const index = prods.findIndex(prod => prod.id == productId);
        if (prods[index].inventory.quantity_for_sale == 1) {
            kickProduct(productId)
            return
        } else {
            prods[index].inventory.quantity_for_sale -= 1;
            prods[index].is_selected = 1;
            const sale_detail = updateTSaleDetails(prods)
            setSale({...sale, 'products': prods, 'sale_detail': sale_detail});
        }
    }

    const kickProduct = (productId) => {
        console.log(productId)
        const prods = sale.products;
        const index = prods.findIndex(prod => prod.id == productId);
        prods.splice(index, 1)
        const sale_detail = updateTSaleDetails(prods)
        setSale({...sale, 'products': prods, 'sale_detail': sale_detail});
    }

    const websocketConn =  () => {
        const client_id = Date.now()
        const wsClient = new WebSocket(`ws://localhost:8001/ws/${client_id}`);
        wsClient.onmessage = (event) => {
            const received = JSON.parse(event.data)
            if (received.sharable != undefined){
                console.log(received.sharable.id, received.sharable.name)
                const pr_index = productItems.findIndex(dt => dt.id == received.sharable.id)
                let productItems_copy = [...productItems]
                productItems_copy[pr_index] = received.sharable
                setProductItems(productItems_copy)
            } else {
                console.log(received)
            }
        }
    }

    useEffect(() => {
        // websocketConn();
    }, [productItems])

    useEffect(() => {
        loadProducts();
        loadClients();
        console.log('-useEffect: called.')
    }, [])

    const contextValue = { 
        productItems, 
        setProductItems, 
        isproductsLoading, 
        pickProduct,
        kickProduct,
        reduceProduct,
        clients, 
        setClients, 
        isclientloading, 
        assigClient,
        postAddClient,
        putUpdateClient,
        sale, 
        setSale,
        updateTSaleDetails,
    }
    return (<AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>)
};

export const useAPI = () => {
    console.log('useAPI: called.')
    const context = useContext(AppContext)
    return context;
};

