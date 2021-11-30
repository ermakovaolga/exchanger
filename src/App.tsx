import React, {useState, useRef, useCallback, useMemo} from 'react';
import 'react-widgets/styles.css';
import { from } from 'rxjs';

import './App.css';

import { getMoneySign } from './features/helpers';
import { AccountsExchangerBlock } from './features/components/AccountsExchangerBlock';
import {
    CURRENCIES,
    RatesProps,
    RatesResponceProps,
    APP_ID,
    DELAY_POLLING,
    serverURL,
    AccountProps,
    ACCOUNTS_INIT_VALUE
} from './core';
import { useInterval } from './features/hooks';
import Icons from './features/components/Icons';

function App() {
    const [sellDirection, setSellDirection] = useState(true);

    const sellText =(sellDirection ? 'Sell ': 'Buy');

    const [fromCurrency, setFromCurrency] = useState<CURRENCIES>(CURRENCIES.USD);
    const [toCurrency, setToCurrency] = useState<CURRENCIES>(CURRENCIES.EUR);

    const [fromAccountCurrencyRate, setFromAccountCurrencyRate] = useState<number>(1);
    const [toAccountCurrencyRate, setToAccountCurrencyRate] = useState<number>(0);

     const onCurrencyAccountChange = (value: CURRENCIES, isFrom: boolean, rates: RatesProps|null) => {
        if(rates) {
            if(isFrom) {
                setFromCurrency(value);
            } else {
                setToCurrency(value);
            }
            const formula = isFrom ? rates[toCurrency] / rates[value] : rates[value] / rates[fromCurrency];
            setFromAccountCurrencyRate(1);
            setToAccountCurrencyRate(formula);
        }
    };
    const [rates, setRates] = useState<RatesProps|null>(null);
    const [error, setError] = useState('');
    const [accounts,] = useState<AccountProps[]>(ACCOUNTS_INIT_VALUE) ;


    const callbackFn = (result: RatesResponceProps) => {
        setError('');
        setRates(result.rates || null);
        if(result.rates) {
            if(fromAccountCurrencyRate !== result.rates[fromCurrency]) {
                setFromAccountCurrencyRate(result.rates[fromCurrency]);
                onCurrencyAccountChange(fromCurrency, true, result.rates);
            }
            if(toAccountCurrencyRate !== result.rates[toCurrency]) {
               // setToAccountCurrencyRate(result.rates[toCurrency]);
                onCurrencyAccountChange(toCurrency, false, result.rates);
            }
        }
    };

    useInterval({
        error: error,
        skipWhileFn: (err) => err.length !== 0,
        callback: callbackFn,
        mergeMapFn: ((clb: (data: any) => void) => from(fetch(`${serverURL}/latest.json?app_id=${APP_ID}`)
            .then(res =>  {
                return res.ok ? res.json() : Promise.reject(res);
            })
            .then(result => clb(result))
            .catch((e) => {
                setError(`Server error: ${e.url} ${e.status} ${e.statusText}`);
        }))),
        delayInterval: DELAY_POLLING,
    });

    const onAccChange = ((value: any, isFrom: boolean ) => onCurrencyAccountChange(value, isFrom, rates));

    return (
        <div className="App">
            <div className={'Exchange'}>
                <div className={'ExchangeBody'}>
                    <h3>{`${sellText} ${fromCurrency}`}</h3>
                    <p>
                        <img
                            src={Icons.money}
                            style={{width: '16px', marginRight: '8px'}}
                            alt={'Money'}
                        />
                        <img
                            style={{width: '16px', position:'relative', top: '1px', margin: '0 2px 0 4px'} }
                            alt={fromCurrency}
                            src={getMoneySign(fromCurrency)}
                        />
                        {fromAccountCurrencyRate === 0 ? fromAccountCurrencyRate : fromAccountCurrencyRate.toFixed(2) + ' = ' }
                        <img
                            alt={toCurrency}
                            style={{width: '16px', position:'relative', top: '1px', margin: '0 2px 0 4px'}}
                            src={getMoneySign(toCurrency)}
                        />
                        {toAccountCurrencyRate.toFixed(2)}
                    </p>

                    <AccountsExchangerBlock
                        rates={rates}
                        accounts={accounts}
                        fromAccountCurrencyValue={fromCurrency}
                        toAccountCurrencyValue={toCurrency}
                        sellDirection={sellDirection}
                        setSellDirection={setSellDirection}
                        toAccountCurrencyRate={toAccountCurrencyRate}
                        onAccountChange={onAccChange}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
