import React, { useEffect, useState } from "react";
import { useDispatch , useSelector} from "react-redux";
import { loadSales } from "../redux/features/sale.feature.js";



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
                  {suggestion.name} - {suggestion.id}
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
    const dispatch = useDispatch();
    const clientState = useSelector((state) => state.client);
    const {loading, errorMessage, clients } = clientState;

    const [icon, setIcon] = useState('search');

    const [inputValue, setInputValue] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = React.useState(0);
    const [displaySuggestions, setDisplaySuggestions] = React.useState(false);

    const suggestions = [...clients];
      
    
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
            client_id: 0,
          };
        dispatch(loadSales(data_range));
        
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
            console.log('client_id', client_id);

            const data_range = {
                'init_date': _init_date,
                'end_date':  _end_date,
                'invoice_status': _invoice_status,
                'client_id': client_id,
              };
              dispatch(loadSales(data_range));

        };

        const btns = document.querySelectorAll('.fbutton');
        btns.forEach((b) => { 
            b.addEventListener('click', () => active_btn(b));
         });

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
        <button className="fbutton fbutton-red" data-invoice-status="cancelled">
            <span className="material-icons-sharp"> auto_delete </span>
            <span>CANCELLED</span>
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