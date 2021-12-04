import React, { useEffect, useState } from 'react';
import 'react-widgets/styles.css';
import { from } from 'rxjs';

import './ExchangerControl.css';

import {
    AccountProps,
    ACCOUNTS_INIT_VALUE,
    APP_ID,
    CURRENCIES, CurrencyProps,
    DELAY_POLLING,
    DELAY_SUCCESS,
    NotificationProps,
    RatesProps,
    RatesResponceProps,
    serverURL
} from './core';
import { useInterval } from './features/hooks';
import Icons from './features/components/Icons';
import { AccountsExchangerBlock, RatePanel } from './features/components';

function ExchangerControl() {

    const [accounts,] = useState<AccountProps[]>(ACCOUNTS_INIT_VALUE) ;
    const [sellDirection, setSellDirection] = useState(true);

    const sellText =(sellDirection ? 'Sell ': 'Buy');

    const [currencyFromState, setCurrencyFromState ] = useState<CurrencyProps>({isFrom: true, currency: CURRENCIES.USD, rate: 0, balance: 0});
    const [currencyToState, setCurrencyToState ] = useState<CurrencyProps>({isFrom: false, currency: CURRENCIES.EUR, rate: 0, balance: 0});

    const onCurrencyAccountChange = (value: string, isFrom: boolean, rates: RatesProps|null) => {
         const currency = value as keyof typeof CURRENCIES;
         if(rates) {
             const currentAccount = accounts.filter((account) => account.currency === currency);
            if(isFrom) {
                setCurrencyFromState({currency: CURRENCIES[currency], isFrom: currencyFromState.isFrom, rate: rates[currency], balance:  currentAccount[0].balance} );
            } else {
                setCurrencyToState({currency: CURRENCIES[currency], isFrom: currencyToState.isFrom, rate: rates[currency], balance: currentAccount[0].balance} );
            }
        }
    };
    const [rates, setRates] = useState<RatesProps|null>(null);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState<NotificationProps>({className: 'NotificationSuccess', message: ''});

    const loadRatesCallback = (result: RatesResponceProps) => {
        setError('');
        setRates(result.rates || null);
        if(result.rates) {
            if(currencyFromState.rate !== result.rates[currencyFromState.currency]) {
                setCurrencyFromState({currency: CURRENCIES[currencyFromState.currency], isFrom: currencyFromState.isFrom, rate: result.rates[currencyFromState.currency], balance: currencyFromState.balance} )
                onCurrencyAccountChange(currencyFromState.currency, currencyFromState.isFrom, result.rates);
            }
            if(currencyToState.rate !== result.rates[currencyToState.currency]) {
                onCurrencyAccountChange(currencyToState.currency, currencyToState.isFrom, result.rates);
            }
        }
    };

    useInterval<RatesResponceProps, void>({
        error: error,
        skipWhileFn: (err) => err.length !== 0,
        callback: loadRatesCallback,
        mergeMapFn: ((clb: (data: RatesResponceProps) => void) => from(fetch(`${serverURL}/latest.json?app_id=${APP_ID}`)
            .then(res =>  {
                return res.ok ? res.json() : Promise.reject(res);
            })
            .then(result => clb(result))
            .catch((e) => {
                setError(`Server error: ${e.url} ${e.status} ${e.statusText}`);
        }))),
        delayInterval: DELAY_POLLING,
    });

    const onCurrencyChange = ((value: string, isFrom: boolean ) => onCurrencyAccountChange(value, isFrom, rates));

    const onSubmit = (fromMoneyInput: string,  toMoneyInput: string) => {
        const newFromBalance = (sellDirection ? currencyFromState.balance-Number(fromMoneyInput) : currencyFromState.balance+Number(fromMoneyInput));
        setCurrencyFromState({currency: CURRENCIES[currencyFromState.currency], isFrom: currencyFromState.isFrom, rate: currencyFromState.rate, balance: newFromBalance});

        setTimeout(() => {
            setNotification({className: 'NotificationSuccess', message: ''});
        }, DELAY_SUCCESS);
        setNotification({className: 'NotificationSuccess', message: `${sellDirection ? fromMoneyInput : toMoneyInput} ${sellDirection ? currencyFromState.currency : currencyToState.currency} was succesfully exchanged`})

        const selectedAccount = accounts.find(item => item.currency === currencyFromState.currency);
        if (selectedAccount) {
            selectedAccount.balance = newFromBalance;
        }

        const newToBalance = (sellDirection ? currencyToState.balance+Number(toMoneyInput) : currencyToState.balance-Number(toMoneyInput));
        setCurrencyToState({currency: CURRENCIES[currencyToState.currency], isFrom: currencyToState.isFrom, rate: currencyToState.rate, balance: newToBalance});
        const selectedToAccount = accounts.find(item => item.currency === currencyToState.currency);
        if (selectedToAccount) {
            selectedToAccount.balance = newToBalance;
        }
    };
    useEffect(() => {
        setNotification({className: 'SubmitNotification', message: error});
    }, [error]);

    return (
        <div className={'ExchangerControl'}>
            <div className={'Exchange'}>
                <div className={'ExchangeBody'}>
                    <h3>{`${sellText} ${currencyFromState.currency}`}</h3>
                    <div className={'ExchangeRatesPanel'}>
                        <img
                            src={Icons.money}
                            width={16}
                            className={'MoneyIcon'}
                            alt={'Money'}
                        />
                        <RatePanel
                            currencyState={currencyFromState}
                            text={`${currencyFromState.rate === 0 ? 0 :1} =`}
                        />
                        <RatePanel
                            currencyState={currencyToState}
                            text={currencyFromState.rate === 0 ? '0' : (currencyToState.rate / currencyFromState.rate).toFixed(2)}
                        />
                    </div>

                    <AccountsExchangerBlock
                        accounts={accounts}
                        currencyFromState={currencyFromState}
                        currencyToState={currencyToState}
                        sellDirection={sellDirection}
                        setSellDirection={setSellDirection}
                        onCurrencyChange={onCurrencyChange}
                        onSubmit={onSubmit}
                        notification={notification}
                    />

                </div>
            </div>
        </div>
    );
}

export default ExchangerControl;
