import React, { useEffect, useState} from 'react';

import { AccountMoneyInput } from './AccountMoneyInput';
import { AccountProps, CURRENCIES, RatesProps, ACCOUNTS_INIT_VALUE } from '../../core';
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
        fromAccountCurrencyValue: CURRENCIES,
        toAccountCurrencyValue: CURRENCIES;
        toAccountCurrencyRate: number;
        rates: RatesProps|null;
        onAccountChange?: (value: string, idFrom: boolean) => void;
        error: string;
    }
) => {

    const [notification, setNotification] = useState('');

    const [validFrom, setValidFrom] = useState<boolean>(true);
    const [validTo, setValidTo] = useState<boolean>(false);

    const [fromMoneyInput, setFromMoneyInput] = useState<number>(0);
    const [toMoneyInput, setToMoneyInput] = useState<number>(0);

    const [fromAccountCount, setFromAccountCount] = useState<number>(0);

    const [toAccountCount, setToAccountCount] = useState<number>(0);

    const [inputFromError, setInputFromError] = useState<string>('');
    const [inputToError, setInputToError] = useState<string>('');

    const onSubmit = (fromAccountCount: number, fromMoneyInput: number) => {
        const newFromBalance = (sellDirection ? fromAccountCount-fromMoneyInput : fromAccountCount+fromMoneyInput);
        setFromAccountCount(newFromBalance);
        const selectedAccount = accounts.find(item => item.currency === fromAccountCurrencyValue);
        if (selectedAccount) {
            selectedAccount.balance = newFromBalance;
        }
        const newToBalance = (sellDirection ? toAccountCount+toMoneyInput : toAccountCount-toMoneyInput);
        setFromAccountCount(newToBalance);
        const selectedToAccount = accounts.find(item => item.currency === toAccountCurrencyValue);
        if (selectedToAccount) {
            selectedToAccount.balance = newToBalance;
        }
        setToAccountCount(newToBalance);
        setToMoneyInput(0);
        setFromMoneyInput(0);
    };

    const onInputChange = (value: string, isFrom: boolean, callback: (val: number, toAccountRate: number) => void) => {
        setInputFromError('');
        setInputToError('');
        if(isNaN(Number(value))) {
            const msg = 'The input should be number';
            isFrom ? setInputFromError(msg) : setInputToError(msg);
        } else {
            const val = Number(value) < 0 ? (Number(value) * -1) : Number(value);
            callback(val, toAccountCurrencyRate);
        }
    };

    const onFromInputChange = (value: string) => {
        onInputChange(value, true,(val, toAccountRate) => {
            setFromMoneyInput(val);
            setToMoneyInput(val * toAccountRate);
        });
    };

    const onToInputChange = (value: string) => {
        onInputChange(value, false,(val, toAccountRate) => {
            setToMoneyInput(val);
            setFromMoneyInput(toAccountCurrencyRate ? val/toAccountCurrencyRate : toAccountCurrencyRate);
        });
    };
    const [accounts,] = useState<AccountProps[]>(ACCOUNTS_INIT_VALUE) ;

    useEffect(() => {
        onFromInputChange(fromMoneyInput.toString());
    }, [toAccountCurrencyRate]);

    useEffect(() => {
        setNotification(error);
    }, [error]);

    return (
        <div>
            <AccountMoneyInput
                accounts={ accounts.filter((acc) => acc.currency !== toAccountCurrencyValue) }
                rates={rates}
                value={fromAccountCurrencyValue}
                onCurrencyChange={(v) => onAccountChange?.(v, true)}
                balanceValue={fromAccountCount}
                valid={validFrom}
                inputMoneyValue={fromMoneyInput === 0 ? '0' : (sellDirection ? '-' : '+') + fromMoneyInput.toFixed(2)}
                onInputMoneyChange={onFromInputChange}
                setValid={setValidFrom}
                setAccountCount={setFromAccountCount}
                inputFromError={inputFromError}
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
                accounts={ accounts.filter((acc) => acc.currency !== fromAccountCurrencyValue)}
                setValid={setValidTo}
                rates={rates}
                valid={validTo}
                value={toAccountCurrencyValue}
                onCurrencyChange={(v) => onAccountChange?.(v, false)}
                balanceValue={toAccountCount}
                inputMoneyValue={toMoneyInput === 0 ? '0' : (sellDirection ? '+' : '-') + toMoneyInput.toFixed(2)}
                onInputMoneyChange={onToInputChange}
                setAccountCount={setToAccountCount}
                inputToError={inputToError}
            />
            <div className={"SubmitNotification"} data-testid={'notificationBlock'}>
                {notification}
            </div>
            <div>
                <button disabled={!validTo || !validFrom} className={'ExchangeSubmit'} onClick={() => onSubmit(fromAccountCount, fromMoneyInput)}>
                    {`${sellDirection ? 'Sell ': 'Buy'} ${fromAccountCurrencyValue} for ${toAccountCurrencyValue}`}
                </button>
            </div>
        </div>
    )
}
