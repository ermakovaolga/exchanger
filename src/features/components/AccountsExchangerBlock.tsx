import React, { useEffect, useState} from 'react';

import { AccountMoneyInput } from './AccountMoneyInput';
import {AccountProps, CURRENCIES, RatesProps, ACCOUNTS_INIT_VALUE, DELAY_SUCCESS} from '../../core';
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
        accounts,
    }: {
        sellDirection: boolean;
        setSellDirection?: React.Dispatch<React.SetStateAction<boolean>>;
        fromAccountCurrencyValue: CURRENCIES,
        toAccountCurrencyValue: CURRENCIES;
        toAccountCurrencyRate: number;
        rates: RatesProps|null;
        onAccountChange?: (value: string, idFrom: boolean) => void;
        error: string;
        accounts: AccountProps[];
    }
) => {

    const [notification, setNotification] = useState('');

    const [validFrom, setValidFrom] = useState<boolean>(true);
    const [validTo, setValidTo] = useState<boolean>(false);

    const [fromMoneyInput, setFromMoneyInput] = useState<string>('');
    const [toMoneyInput, setToMoneyInput] = useState<string>('');

    const [fromAccountCount, setFromAccountCount] = useState<number>(0);

    const [toAccountCount, setToAccountCount] = useState<number>(0);

    const [inputFromError, setInputFromError] = useState<string>('');
    const [inputToError, setInputToError] = useState<string>('');

    const onSubmit = (fromAccountCount: number, fromMoneyInput: number) => {
        const newFromBalance = (sellDirection ? fromAccountCount-fromMoneyInput : fromAccountCount+fromMoneyInput);
        setFromAccountCount(newFromBalance);
        setTimeout(() => {
            setNotification('');
        }, DELAY_SUCCESS);
        setNotification(`${sellDirection ? fromMoneyInput : toMoneyInput} ${sellDirection ? fromAccountCurrencyValue : toAccountCurrencyValue} was succesfully exchanged`)
        const selectedAccount = accounts.find(item => item.currency === fromAccountCurrencyValue);
        if (selectedAccount) {
            selectedAccount.balance = newFromBalance;
        }
        const newToBalance = (sellDirection ? toAccountCount+Number(toMoneyInput) : toAccountCount-Number(toMoneyInput));
        setFromAccountCount(newToBalance);
        const selectedToAccount = accounts.find(item => item.currency === toAccountCurrencyValue);
        if (selectedToAccount) {
            selectedToAccount.balance = newToBalance;
        }
        setToAccountCount(newToBalance);
        setToMoneyInput('');
        setFromMoneyInput('');
    };

    const onInputChange = (value: string, isFrom: boolean, callback: (val: string, toAccountRate: number) => void) => {
        setInputFromError('');
        setInputToError('');
        if(value === '+' || value === '-') {
            value = '0';
        }
        if(isNaN(Number(value))) {
            const msg = 'The input should be number';
            isFrom ? setInputFromError(msg) : setInputToError(msg);
        } else {
            if(value.indexOf('.') >=0) {
                if (value.substring(value.indexOf('.') + 1, value.length).length === 0 && Number(value) < 0) {
                    value = value.substring(1, value.length);
                } else {
                    if (value.substring(value.indexOf('.') + 1, value.length).length > 0 && Number(value) < 0) {
                        value = (Number(value) * -1).toFixed(value.substring(value.indexOf('.') + 1, value.length).length);
                    }
                }
                if(value.substring(value.indexOf('.') + 1, value.length).length > 2) {
                    value = Number(value).toFixed(2);
                }
                if(value.indexOf('+') >=0 ) {
                    value = value.substring(value.indexOf('+')+1, value.length);
                }
                callback(value, toAccountCurrencyRate);
            } else {
                if (value !== "") {
                    value = (Number(value) < 0 ? (Number(value) * -1) : Number(value)).toString();
                }
                callback(value, toAccountCurrencyRate);

            }
        }
    };
    const onFromInputChange = (value: string) => {
        onInputChange(value, true,(val, toAccountRate) => {
            setFromMoneyInput(val);
            setToMoneyInput(val ? ((Number(val) * toAccountRate).toFixed(2)) : val);
        });
    };

    const onToInputChange = (value: string) => {
        onInputChange(value, false,(val, toAccountRate) => {
            setToMoneyInput(val);
            setFromMoneyInput(val ? (toAccountCurrencyRate ? Number(val)/toAccountCurrencyRate : toAccountCurrencyRate).toFixed(2) : val);
        });
    };

    const onFromMoneyBlur = (value: string) => {
        if(value.indexOf('.') >=0 && value.indexOf('.') === value.length-1) {
            setFromMoneyInput((value));
        }
    }

    const onToMoneyBlur = (value: string) => {
        if(value.indexOf('.') >=0 && value.indexOf('.') === value.length-1) {
            setToMoneyInput((Number(value) < 0 ? Number(value) * -1 : Number(value)).toString());
        }
    }

    useEffect(() => {
        onFromInputChange(fromMoneyInput.toString());
    }, [toAccountCurrencyRate]);

    useEffect(() => {
        setNotification(error);
    }, [error]);

    return (
        <div>
            <AccountMoneyInput
                accounts={ accounts.filter((acc) => acc.currency !== toAccountCurrencyValue)  }
                rates={rates}
                value={fromAccountCurrencyValue}
                onCurrencyChange={(v) => onAccountChange?.(v, true)}
                balanceValue={fromAccountCount}
                valid={validFrom}
                inputMoneyValue={fromMoneyInput === "" ? "" : (fromMoneyInput === '0' ? '0' : ((sellDirection ? '-' : '+') + fromMoneyInput))}
                onInputMoneyChange={onFromInputChange}
                setValid={setValidFrom}
                setAccountCount={setFromAccountCount}
                inputFromError={inputFromError}
                onBlurMoneyInput={onFromMoneyBlur}
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
                inputMoneyValue={toMoneyInput === "" ? "" : (Number(toMoneyInput) === 0 ? '0' : (sellDirection ? '+' : '-') + toMoneyInput)}
                onInputMoneyChange={onToInputChange}
                setAccountCount={setToAccountCount}
                inputToError={inputToError}
                onBlurMoneyInput={onToMoneyBlur}
            />
            <div className={"SubmitNotification"} data-testid={'notificationBlock'}>
                {notification}
            </div>
            <div>
                <button disabled={!validTo || !validFrom} className={'ExchangeSubmit'} onClick={() => onSubmit(fromAccountCount, Number(fromMoneyInput))}>
                    {`${sellDirection ? 'Sell ': 'Buy'} ${fromAccountCurrencyValue} for ${toAccountCurrencyValue}`}
                </button>
            </div>
        </div>
    )
}
