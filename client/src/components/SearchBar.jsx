import React, { useEffect, useState } from "react";
import { useDispatch , useSelector} from "react-redux";
import { loadSales } from "../redux/features/sale.feature.js";


export const SearchBar = () => {
    const dispatch = useDispatch();
    const [icon, setIcon] = useState('search');


    useEffect(() => {
        const MONTH_BACK = 2;
        let end_date = new Date();
        let init_date = new Date();
        init_date.setMonth(init_date.getMonth() - MONTH_BACK);
        end_date = end_date.toISOString().split('T')[0];
        init_date = init_date.toISOString().split('T')[0];
        document.querySelector('.init_date').value = init_date;
        document.querySelector('.end_date').value = end_date;
        end_date  = `${end_date} 23:59:59`;
        init_date = `${init_date} 00:00:00`;


        const data_range = {
            init_date: init_date,
            end_date:  end_date,
            invoice_status: 'all',
          };
        dispatch(loadSales(data_range));
        
    });

    
    useEffect(()=> {
        const active_btn = (item) => {
            const btns = document.querySelectorAll('.fbutton');
            btns.forEach((b) => {
                b.classList.forEach((c) => {
                    if (c.includes("active")) {
                        b.classList.remove(c);
                    }
                });
            });

            let t;
            item.classList.forEach((c) => {
                if (c.includes('fbutton-')) {
                    t = c;
                }
            });
            item.classList.add(t + '-active');


            const _invoice_status = item.dataset.invoiceStatus;
            const _init_date = `${document.querySelector('.init_date').value} 00:00:00`;
            const _end_date  = `${document.querySelector('.end_date').value} 23:59:59`;

            const data_range = {
                'init_date': _init_date,
                'end_date':  _end_date,
                'invoice_status': _invoice_status,
              };
              dispatch(loadSales(data_range));
        };

        const btns = document.querySelectorAll('.fbutton');
        btns.forEach((b) => { 
            b.addEventListener('click', () => active_btn(b));
         });


        const search = document.querySelector(".search-wrap");
        const btn = document.querySelector(".fancy-btn");
        const input = document.querySelector(".input-fancy");
        btn.addEventListener("click", () => {
            search.classList.toggle("active");
            input.focus();
            // setIcon('close' === {...icon} ? 'search' : 'close');
            // console.log({...icon});
        });

    }, []);


    return (
     <div className="search-bar">
        <div className="date">
            <input type="date" className="init_date"  />
        </div>
        <div className="date">
            <input type="date" className="end_date" />
        </div>
        <button className="fbutton fbutton-green fbutton-green-active" data-invoice-status="all" >
            <span className="material-icons-sharp"> all_inclusive </span>
            <span>ALL</span>
        </button>
        <button className="fbutton fbutton-orange" data-invoice-status="open">
            <span className="material-icons-sharp"> lock_open </span>
            <span>OPEN</span>
        </button>
        <button className="fbutton fbutton-purple" data-invoice-status="close">
            <span className="material-icons-sharp"> lock </span>
            <span>CLOSE</span>
        </button>
        <button className="fbutton fbutton-red" data-invoice-status="canceled">
            <span className="material-icons-sharp"> auto_delete </span>
            <span>CANCELED</span>
        </button>
        <div className="search-wrap">
            <input type="text" className="input-fancy" placeholder="Search..." />
            <button className="fancy-btn">
                 <span className="material-icons-sharp search-icon">{icon}</span>
            </button>
        </div>
     </div>
    )
}