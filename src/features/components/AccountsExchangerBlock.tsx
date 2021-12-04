import React, { useEffect, useState} from 'react';

import { AccountMoneyInput } from './AccountMoneyInput';
import { AccountProps, CurrencyProps, NotificationProps } from '../../core';
import Icons from './Icons';

export const AccountsExchangerBlock = (
    {
        sellDirection,
        setSellDirection,
        currencyFromState,
        currencyToState,
        onCurrencyChange,
        accounts,
        onSubmit,
        notification,
    }: {
        sellDirection: boolean;
        setSellDirection?: React.Dispatch<React.SetStateAction<boolean>>;
        currencyFromState: CurrencyProps,
        currencyToState: CurrencyProps,
        onCurrencyChange?: (value: string, isFrom: boolean) => void;
        accounts: AccountProps[];
        onSubmit: (fromValue: string, toValue: string) => void;
        notification: NotificationProps;
    }
) => {
    const [disabledSubmit, setDisabledSubmit] = useState<boolean>(true);

    const [validFrom, setValidFrom] = useState<boolean>(true);
    const [validTo, setValidTo] = useState<boolean>(false);

    const [inputFromError, setInputFromError] = useState<string>('');
    const [inputToError, setInputToError] = useState<string>('');

    const [fromMoneyInput, setFromMoneyInput] = useState<string>('');
    const [toMoneyInput, setToMoneyInput] = useState<string>('');


    const onInputChange = (value: string, currencyState: CurrencyProps) => {
        setInputFromError('');
        setInputToError('');
        const reg = /^[+-]?\d+[.]?[\d]?[\d]?$/;
        if (value !== "") {
            if(value === '-' || value === '+') {
                value = '0';
            }
            if (reg.test(value)) {
                value = (value.length > 1 && value.match(/[+-]/) != null) ? value.substring(1, value.length) : value;
                const toAccountRate = currencyToState.rate / currencyFromState.rate;
                const ratedToValue = value ? ((Number(value) * toAccountRate).toFixed(2)) : value;
                const ratedFromValue = value ? (toAccountRate ? Number(value)/toAccountRate : toAccountRate).toFixed(2) : value;
                setFromMoneyInput(currencyState.isFrom ? value : ratedFromValue);
                setToMoneyInput(currencyState.isFrom ? ratedToValue : value);
            } else {
                const msg = 'The value should be a number';
                currencyState.isFrom ? setInputFromError(msg) : setInputToError(msg);
            }
        }
    };

    const onFromMoneyBlur = (value: string) => {
        if(value.indexOf('.') >=0 && value.indexOf('.') === value.length-1) {
            setFromMoneyInput((Number(value) > 0 ? Number(value) : (-1* Number(value))).toString());
        }
    }

    const onToMoneyBlur = (value: string) => {
        if(value.indexOf('.') >=0 && value.indexOf('.') === value.length-1) {
            setToMoneyInput((Number(value) < 0 ? Number(value) * -1 : Number(value)).toString());
        }
    }

    useEffect(() => {
        onInputChange(toMoneyInput.toString(), currencyToState);
    }, [currencyToState]);

    useEffect(() => {
        onInputChange(fromMoneyInput.toString(), currencyFromState);
    }, [currencyFromState]);

    useEffect(() => {
        setDisabledSubmit?.(!validTo || !validFrom);
    },[validTo, validFrom]);
//
   //
    return (
        <div>
            <AccountMoneyInput
                currencyState={currencyFromState}
                accounts={ accounts.filter((acc) => acc.currency !== currencyToState.currency)  }
                onCurrencyChange={(v) => onCurrencyChange?.(v, currencyFromState.isFrom)}
                valid={validFrom}
                inputError={inputFromError}
                inputMoneyValue={fromMoneyInput === "" ? "" : (fromMoneyInput === '0' ? '0' : ((sellDirection ? '-' : '+') + fromMoneyInput))}
                onInputMoneyChange={onInputChange}
                setValid={setValidFrom}
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
                accounts={ accounts.filter((acc) => acc.currency !== currencyFromState.currency)}
                setValid={setValidTo}
                valid={validTo}
                inputError={inputToError}
                currencyState={currencyToState}
                onCurrencyChange={(v: string) => onCurrencyChange?.(v, currencyToState.isFrom)}
                inputMoneyValue={toMoneyInput === "" ? "" : (Number(toMoneyInput) === 0 ? '0' : (sellDirection ? '+' : '-') + toMoneyInput)}
                onInputMoneyChange={onInputChange}
                onBlurMoneyInput={onToMoneyBlur}
            />
            <div className={notification.className} data-testid={'notificationBlock'}>
                {notification.message}
            </div>
            <div>
                <button disabled={disabledSubmit} className={'ExchangeSubmit'} onClick={() => {
                    onSubmit(fromMoneyInput, toMoneyInput);
                    setToMoneyInput('');
                    setFromMoneyInput('');
                }}>
                    {`${sellDirection ? 'Sell ': 'Buy'} ${currencyFromState.currency} for ${currencyToState.currency}`}
                </button>
            </div>
        </div>
    )
}
