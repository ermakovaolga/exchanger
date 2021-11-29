import React, { useState, useRef, useCallback } from 'react';
import 'react-widgets/styles.css';
import { from } from 'rxjs';

import './App.css';

import { getMoneySign } from './features/helpers';
import { AccountsExchangerBlock } from './features/components/AccountsExchangerBlock';
import {CURRENCIES, RatesProps, RatesResponceProps, APP_ID, DELAY_POLLING, serverURL} from './core';
import { useInterval } from './features/hooks';
import Icons from "./features/components/Icons";

function App() {

    const [sellDirection, setSellDirection] = useState(true);

    const sellText =(sellDirection ? 'Sell ': 'Buy');

    const fromAccountCurrencyValue = useRef<CURRENCIES>(CURRENCIES.USD);
    const toAccountCurrencyValue = useRef<CURRENCIES>(CURRENCIES.EUR);

    const [fromAccountCurrencyRate, setFromAccountCurrencyRate] = useState<number>(1);
    const [toAccountCurrencyRate, setToAccountCurrencyRate] = useState<number>(0);

    const onCurrencyAccountChange=(value: CURRENCIES, isFrom: boolean, rates: RatesProps|null) => {
        if(isFrom) {
            fromAccountCurrencyValue.current = value;
        } else {
            toAccountCurrencyValue.current = value;
        }
        if(rates) {
            const formula = isFrom ? rates[toAccountCurrencyValue.current] / rates[value] : rates[value] / rates[fromAccountCurrencyValue.current];
            setFromAccountCurrencyRate(1);
            setToAccountCurrencyRate(formula);
        }
    };
    const [rates, setRates] = useState<RatesProps|null>(null);
    const error = useRef('');

    const callbackFn = useCallback((result: RatesResponceProps) => {
        setRates(result.rates || null);
        if(result.rates) {
            if(fromAccountCurrencyRate !== result.rates[fromAccountCurrencyValue.current]) {
                setFromAccountCurrencyRate(result.rates[fromAccountCurrencyValue.current]);
                onCurrencyAccountChange(fromAccountCurrencyValue.current, true, result.rates);
            }
            if(toAccountCurrencyRate !== result.rates[toAccountCurrencyValue.current]) {
                setToAccountCurrencyRate(result.rates[toAccountCurrencyValue.current]);
                onCurrencyAccountChange(toAccountCurrencyValue.current, false, result.rates);
            }
        }
    }, []);

    useInterval({
        skipWhileFn: () => error.current.length !== 0,
        mergeMapFn: (() => from(fetch(`${serverURL}/latest.json?app_id=${APP_ID}`).then(res =>  res.ok ? res.json() : Promise.reject(res)).then(result => callbackFn(result)).catch((e) => {
            error.current = (`Server error: ${e.url} ${e.status} ${e.statusText}`);
        }))),
        delayInterval: DELAY_POLLING,
    });

    const onAccChange = (value: any, isFrom: boolean ) => onCurrencyAccountChange(value, isFrom, rates);

    return (
        <div className="App">
            <div className={'Exchange'}>
                <div className={'ExchangeBody'}>
                    <h3>{`${sellText} ${fromAccountCurrencyValue.current}`}</h3>
                    <p>
                        <img
                            src={Icons.money}
                            style={{width: '16px'}}
                            alt={'Money'}
                        />
                        <img
                            style={{width: '24px', position:'relative', top: '6px'} }
                            alt={fromAccountCurrencyValue.current}
                            src={getMoneySign(fromAccountCurrencyValue.current)}
                        />
                        {fromAccountCurrencyRate + ' = ' }
                        <img
                            alt={toAccountCurrencyValue.current}
                            style={{width: '24px', position:'relative', top: '6px'}}
                            src={getMoneySign(toAccountCurrencyValue.current)}
                        />
                        {toAccountCurrencyRate}
                    </p>

                    <AccountsExchangerBlock
                        rates={rates}
                        fromAccountCurrencyValue={fromAccountCurrencyValue}
                        toAccountCurrencyValue={toAccountCurrencyValue}
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
