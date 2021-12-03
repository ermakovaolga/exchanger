import React, { useEffect, useState} from 'react';

import { AccountMoneyInput } from './AccountMoneyInput';
import { AccountProps, RatesProps, CurrencyProps } from '../../core';
import Icons from './Icons';

export const AccountsExchangerBlock = (
    {
        sellDirection,
        setSellDirection,
        currencyFromState,
        currencyToState,
        rates,
        onAccountChange,
        accounts,
        setToMoneyInput,
        setFromMoneyInput,
        fromMoneyInput,
        toMoneyInput,
        setDisabledSubmit,
    }: {
        sellDirection: boolean;
        setSellDirection?: React.Dispatch<React.SetStateAction<boolean>>;
        currencyFromState: CurrencyProps,
        currencyToState: CurrencyProps,
        rates: RatesProps|null;
        onAccountChange?: (value: string, idFrom: boolean) => void;
        accounts: AccountProps[];
        setToMoneyInput: React.Dispatch<React.SetStateAction<string>>;
        setFromMoneyInput: React.Dispatch<React.SetStateAction<string>>;
        fromMoneyInput: string;
        toMoneyInput: string;
        setDisabledSubmit?: React.Dispatch<React.SetStateAction<boolean>>;
    }
) => {

    const [validFrom, setValidFrom] = useState<boolean>(true);
    const [validTo, setValidTo] = useState<boolean>(false);


    const [inputFromError, setInputFromError] = useState<string>('');
    const [inputToError, setInputToError] = useState<string>('');



    const onInputChange = (value: string, isFrom: boolean, callback: (val: string, toAccountRate: number) => void) => {
        setInputFromError('');
        setInputToError('');
        const reg = /^[+-]?\d+[.]?[\d]?[\d]?$/;
        if (value !== "") {
            if(value === '-' || value === '+') {
                value = '0';
            }
            if (reg.test(value)) {
                value = (value.length > 1 && value.match(/[+-]/) != null) ? value.substring(1, value.length) : value;
                callback(value, currencyToState.rate / currencyFromState.rate);
            } else {
                const msg = 'The value should be a number';
                isFrom ? setInputFromError(msg) : setInputToError(msg);
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
            setFromMoneyInput(val ? (toAccountRate ? Number(val)/toAccountRate : toAccountRate).toFixed(2) : val);
        });
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
        onToInputChange(toMoneyInput.toString());
    }, [currencyToState]);

    useEffect(() => {
        onFromInputChange(fromMoneyInput.toString());
    }, [currencyFromState]);

    useEffect(() => {
        setDisabledSubmit?.(!validTo || !validFrom);
    },[validTo, validFrom]);

    return (
        <div>
            <AccountMoneyInput
                accounts={ accounts.filter((acc) => acc.currency !== currencyToState.currency)  }
                rates={rates}
                value={currencyFromState.currency}
                onCurrencyChange={(v) => onAccountChange?.(v, true)}
                balanceValue={currencyFromState.balance}
                valid={validFrom}
                inputMoneyValue={fromMoneyInput === "" ? "" : (fromMoneyInput === '0' ? '0' : ((sellDirection ? '-' : '+') + fromMoneyInput))}
                onInputMoneyChange={onFromInputChange}
                setValid={setValidFrom}
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
                accounts={ accounts.filter((acc) => acc.currency !== currencyFromState.currency)}
                setValid={setValidTo}
                rates={rates}
                valid={validTo}
                value={currencyToState.currency}
                onCurrencyChange={(v: string) => onAccountChange?.(v, false)}
                balanceValue={currencyToState.balance}
                inputMoneyValue={toMoneyInput === "" ? "" : (Number(toMoneyInput) === 0 ? '0' : (sellDirection ? '+' : '-') + toMoneyInput)}
                onInputMoneyChange={onToInputChange}
                inputToError={inputToError}
                onBlurMoneyInput={onToMoneyBlur}
            />

        </div>
    )
}
