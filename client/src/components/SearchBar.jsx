import React, { useEffect, useRef, useState } from "react";
import { useDispatch , useSelector} from "react-redux";
import { loadSales } from "../redux/features/sale.feature.js";
import { SCOPES } from "../util/constants";
import { abortController } from "../api/abort.js";


import { lang } from "../common/spa.lang.js";



const SuggestionsList = props => {
    const {
      suggestions,
      inputValue,
      onSelectSuggestion,
      displaySuggestions,
      selectedSuggestion
    } = props;
  
    if (inputValue && displaySuggestions) {
      if (suggestions.length > 0) {
        return (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => {
              const isSelected = selectedSuggestion === index;
              const classname = `suggestion ${isSelected ? "selected" : ""}`;
              return (
                <li
                  key={index}
                  className={classname}
                  onClick={() => onSelectSuggestion(index)}
                >
                  {suggestion.name} - {suggestion.celphone}
                </li>
              );
            })}
          </ul>
        );
      } else {
        return <div>No suggestions available...</div>;
      }
    }
    return <></>;
};


export const SearchBar = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const stores = useSelector((state) => state.product.stores);
    const users = useSelector((state) => state.user.users);
    const dispatch = useDispatch();
    const clientState = useSelector((state) => state.client);
    const {errorMessage, clients } = clientState;
    const loading = useSelector((state) => state.sale.loading);

    const [icon, setIcon] = useState('search');

    const [inputValue, setInputValue] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = React.useState(0);
    const [displaySuggestions, setDisplaySuggestions] = React.useState(false);

    const suggestions = [...clients];

    const abortInstance = useRef(abortController());
    const abortInstanceChangeButtons = useRef(abortController());
    
    const [showTime, setShowTime] = useState();
    const [timeoutId, setTimeoutId] = useState();
    
    const onChange = event => {
        const value = event.target.value;
        setInputValue(value);

        const filteredSuggestions = suggestions.filter(cli => {
            if (cli && (JSON.stringify(cli.name) !== 'null' || JSON.stringify(cli.celphone) !== 'null')) {
                return cli.name.toUpperCase().includes(value.toUpperCase()) ||
                    cli.celphone.toUpperCase().includes(value.toUpperCase())
            } else {
                return false
            }
        }
        );

        setFilteredSuggestions(filteredSuggestions);
        setDisplaySuggestions(true);
    };

    const onSelectSuggestion = index => {
        setSelectedSuggestion(index);
        setInputValue(filteredSuggestions[index].name);
        setFilteredSuggestions([]);
        setDisplaySuggestions(false);
        const inp = document.querySelector('.input-fancy'); 
        inp.dataset.clientId = filteredSuggestions[index].id;
    };


    useEffect(() => {
        const HOURS_BACK = 1 * 24;
        let end_date = new Date();
        let init_date = new Date();
        init_date.setHours(init_date.getHours() - HOURS_BACK);
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
            client_id: 0,
            'user_login':  'all',
            'store_s': 'same'
        };

        dispatch(loadSales({data_range, abortInstance}));

    
    }, []);

    
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

            const inp = document.querySelector('.input-fancy'); 
            const client_id =  !isNaN(parseInt(inp.dataset.clientId)) ? inp.dataset.clientId : 0;
            const user_login = document.querySelector('.user-login').value;
            const store_s = document.querySelector('.store-s').value;

            const data_range = {
                'init_date': _init_date,
                'end_date':  _end_date,
                'invoice_status': _invoice_status,
                'client_id': client_id,
                'user_login': user_login,
                'store_s': store_s
              };

              dispatch(loadSales({data_range, abortInstance}));

        };

        const btns = document.querySelectorAll('.fbutton');
        btns.forEach((b) => { 
            b.addEventListener('click', () => active_btn(b));
         });

         return () => {
            onCancelRequest();
         }

    }, []);


   
    const changeIcon = () => {
        const search = document.querySelector(".search-wrap");
        // const btn = document.querySelector(".fancy-btn");
        const input = document.querySelector(".input-fancy");
        search.classList.toggle("active");
        input.focus();
        setIcon((icon == "search") ? "close" : "search");
        setInputValue('');
        const inp = document.querySelector('.input-fancy'); 
        inp.dataset.clientId = 0;
    };

    const onCancelRequest = () => {
        console.log('cancelling.')
        abortInstance.current.abortPendingRequest();
    }
    
    useEffect(() => {
        const bar = document.querySelector('.search-bar');
        if (loading) {
            bar.classList.add('disable-click');

            let ms = 0;
            let sec = 0;
            let min = 0;

            const sw = () => {
                const t = setTimeout(sw, 10);
                setTimeoutId(t);

                ms = parseInt(ms);
                sec = parseInt(sec);
                min = parseInt(min);
 
                ms++;
 
                if (ms == 100) {
                    sec = sec + 1;
                    ms = 0;
                }
                if (sec == 60) {
                    min = min + 1;
                    sec = 0;
                }
                if (ms < 10) {
                    ms = '0' + ms;
                }
                if (sec < 10) {
                    sec = '0' + sec;
                }
                if (min < 10) {
                    min = '0' + min;
                }
 
                const time = min + ':' + sec + ':' + ms;
                setShowTime(time);
            }
            sw();

        } else {
            bar.classList.remove('disable-click');
            clearTimeout(timeoutId);
        }
    }, [loading]);

    return (
     <div className="search-bar">
         <div className="select-div select-store-login">
            <select className="select-from-store user-login" >
            {currentUser && currentUser.scopes.includes(SCOPES.SALES.FILTER.USER) &&
                <option value="all">All users</option>
            }
                { users.map((U, i) => (
                    <option key={i} value={U.username}>{U.username}</option>
                ))}
            </select>
        </div>
        <div className="select-div select-store-login">
            {currentUser && currentUser.scopes.includes(SCOPES.SALES.FILTER.USER) &&
            <select className="select-from-store store-s">
                <option value={currentUser.selectedStore} >{currentUser.selectedStore}</option>
                { stores.map((S, i) => (
                    <option key={i} value={S.name}  >{S.name}</option>
                ))}
            </select>
            }
            {currentUser && !currentUser.scopes.includes(SCOPES.SALES.FILTER.USER) &&
            <select className="select-from-store store-s">
                <option value={currentUser.selectedStore} >{currentUser.selectedStore}</option>
            </select>
            }
        </div>
        <div className="date">
            <input type="date" className="init_date"  />
        </div>
        <div className="date">
            <input type="date" className="end_date" />
        </div>
        {loading &&
        <button className="fbutton-red btn-cancel-request" onClick={onCancelRequest} >
            <span className="material-icons-sharp"> cancel </span>
            <span>Stop Request {showTime} </span>
        </button>
        }
        <button className="fbutton fbutton-green fbutton-green-active" data-invoice-status="all" disabled={loading ? 'disabled' : ''} >
            <span className="material-icons-sharp"> all_inclusive </span>
            <span>{lang.sale.all}</span>
        </button>
        <button className="fbutton fbutton-orange" data-invoice-status="open" disabled={loading ? 'disabled' : ''}>
            <span className="material-icons-sharp"> lock_open </span>
            <span>{lang.sale.open}</span>
        </button>
        <button className="fbutton fbutton-purple" data-invoice-status="close" disabled={loading ? 'disabled' : ''}>
            <span className="material-icons-sharp"> lock </span>
            <span>{lang.sale.close}</span>
        </button>
        <button className="fbutton fbutton-red" data-invoice-status="cancelled" disabled={loading ? 'disabled' : ''}>
            <span className="material-icons-sharp"> auto_delete </span>
            <span>{lang.sale.cancelled}</span>
        </button>
        <div className="search-wrap">
            <input type="text" 
                   className="input-fancy user-input" 
                   onChange={onChange}
                   value={inputValue}
                   placeholder="..."
                   data-client-id />
            <button className="fancy-btn" onClick={changeIcon}>
                 <span className="material-icons-sharp search-icon">{icon}</span>
            </button>
            <SuggestionsList
                inputValue={inputValue}
                selectedSuggestion={selectedSuggestion}
                onSelectSuggestion={onSelectSuggestion}
                displaySuggestions={displaySuggestions}
                suggestions={filteredSuggestions}
            />
        </div>

     </div>
    )
}