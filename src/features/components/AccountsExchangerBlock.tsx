import React, { useEffect, useState } from 'react';

import { AccountMoneyInput } from './AccountMoneyInput';
import {AccountProps, CURRENCIES, RatesProps, ACCOUNTS_INIT_VALUE} from '../../core';
import Icons from './Icons';

export const AccountsExchangerBlock = (
    {
        sellDirection,
        setSellDirection,
        fromAccountCurrencyValue,
        toAccountCurrencyValue,
        toAccountCurrencyRate,
        rates,
        onAccountChange,
        error,
    }: {
        sellDirection: boolean;
        setSellDirection?: React.Dispatch<React.SetStateAction<boolean>>;
        fromAccountCurrencyValue: React.MutableRefObject<CURRENCIES>;
        toAccountCurrencyValue: React.MutableRefObject<CURRENCIES>;
        toAccountCurrencyRate: number;
        rates: RatesProps|null;
        onAccountChange?: (value: string, idFrom: boolean) => void;
        error: React.MutableRefObject<string>;
    }
) => {

    const [notification, setNotification] = useState('');

    const [validFrom, setValidFrom] = useState<boolean>(true);
    const [validTo, setValidTo] = useState<boolean>(false);

    const [fromMoneyInput, setFromMoneyInput] = useState<number>(0);
    const [toMoneyInput, setToMoneyInput] = useState<number>(0);

    const [fromAccountCount, setFromAccountCount] = useState<number>(0);

    const [toAccountCount, setToAccountCount] = useState<number>(0);

    const onSubmit = (fromAccountCount: number, fromMoneyInput: number) => {
        setTimeout(()=>{
            setNotification('');
        }, 10000);
        setNotification(`I will send request which will update balance ${fromAccountCount} 
        on ${sellDirection ? fromAccountCount-fromMoneyInput : fromAccountCount+fromMoneyInput}
         and ${toAccountCount} on ${sellDirection ? toAccountCount+toMoneyInput : toAccountCount-toMoneyInput} and then clean fields`)
    };

    const onFromInputChange = (value: string) => {
        const val = Number(value) < 0 ? (Number(value) *-1) : Number(value);
        setFromMoneyInput(val);
        setToMoneyInput(val*toAccountCurrencyRate);
    };

    const onToInputChange = (value: string) => {
        const val = Number(value) < 0 ? (Number(value) *-1) : Number(value);
        setToMoneyInput(val);
        setFromMoneyInput(toAccountCurrencyRate ? val/toAccountCurrencyRate : toAccountCurrencyRate);
    }
    const [accounts,] = useState<AccountProps[]>(ACCOUNTS_INIT_VALUE) ;

    useEffect(() => {
        onFromInputChange(fromMoneyInput.toString());
    }, [toAccountCurrencyRate]);

    useEffect(() => {
        setNotification(error.current);
    }, [error.current]);
    return (
        <div>
            <AccountMoneyInput
                accounts={ accounts.filter((acc) => acc.currency !== toAccountCurrencyValue.current) }
                rates={rates}
                value={fromAccountCurrencyValue.current}
                onCurrencyChange={(v) => onAccountChange?.(v, true)}
                balanceValue={fromAccountCount}
                valid={validFrom}
                inputMoneyValue={(sellDirection ? '-' : '+') + fromMoneyInput.toFixed(2)}
                onInputMoneyChange={onFromInputChange}
                setValid={setValidFrom}
                setAccountCount={setFromAccountCount}
            />
            <div>
                <img
                    src={!sellDirection ? Icons.up : Icons.down}
                    width={32}
                    onClick={()=>setSellDirection?.(!sellDirection)}
                    alt={!sellDirection ? 'Up' : 'Down'}
                />
            </div>
            <AccountMoneyInput
                accounts={ accounts.filter((acc) => acc.currency !== fromAccountCurrencyValue.current)}
                setValid={setValidTo}
                rates={rates}
                valid={validTo}
                value={toAccountCurrencyValue.current}
                onCurrencyChange={(v) => onAccountChange?.(v, false)}
                balanceValue={toAccountCount}
                inputMoneyValue={(sellDirection ? '+' : '-') + toMoneyInput.toFixed(2)}
                onInputMoneyChange={onToInputChange}
                setAccountCount={setToAccountCount}
            />
            <div className={"SubmitNotification"} data-testid={'notificationBlock'}>
                {notification}
            </div>
            <div>
                <button disabled={!validTo || !validFrom} className={'ExchangeSubmit'} onClick={() => onSubmit(fromAccountCount, fromMoneyInput)}>
                    {`${sellDirection ? 'Sell ': 'Buy'} ${fromAccountCurrencyValue.current} for ${toAccountCurrencyValue.current}`}
                </button>
            </div>
        </div>
    )
}
