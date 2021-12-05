import React, { useEffect, useState } from 'react';

import { AccountMoneyInput } from './AccountMoneyInput';
import {
    AccountProps,
    CurrencyProps,
    InputMoneyProps,
    LESS_BALANCE_MSG,
    NotificationProps,
    NUMBER_MSG
} from '../../core';
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
        setSellDirection: React.Dispatch<React.SetStateAction<boolean>>;
        currencyFromState: CurrencyProps,
        currencyToState: CurrencyProps,
        onCurrencyChange: (value: string, isFrom: boolean) => void;
        accounts: AccountProps[];
        onSubmit: (fromValue: number, toValue: number) => void;
        notification: NotificationProps;
    }
) => {
    const [disabledSubmit, setDisabledSubmit] = useState<boolean>(true);

    const [fromInputState, setFromInputState]= useState<InputMoneyProps>({ valueToShow: '', value: 0, error: ''});
    const [toInputState, setToInputState]= useState<InputMoneyProps>({ valueToShow: '', value: 0, error: ''});

    const onInputChange = (valueFromInput: string, currencyState: CurrencyProps) => {
        valueFromInput = (valueFromInput.length >= 1 && valueFromInput.match(/[+-]/) != null) ? valueFromInput.substring(1, valueFromInput.length) : valueFromInput;
        if (valueFromInput !== "") {
            const reg = /^\d+[.]?[\d]?[\d]?$/;   ///full string ^[+-]?\d+[.]?[\d]?[\d]?$/;
            if (reg.test(valueFromInput)) {
                const input = parseFloat(parseFloat(valueFromInput).toFixed(2));
                if(input === 0) {
                    const nullReg = /^([0]?[.]?$)|^([0]?[.][0]?$)/;
                    if (!nullReg.test(valueFromInput)) {
                        valueFromInput = '0';
                    }
                } else {
                    const nullReg = /^([0]\d+$)/;
                    if (nullReg.test(valueFromInput)) {
                        valueFromInput = input.toString();
                    }
                }
                const toAccountRate =  currencyFromState.rate ? currencyToState.rate / currencyFromState.rate : 0;

                const ratedToValue = currencyState.isFrom ? input * toAccountRate : input;
                const ratedFromValue = currencyState.isFrom ? input : (toAccountRate ? input/toAccountRate : toAccountRate);

                const valueToShowFrom = (sellDirection ? '-' : '+') + (currencyState.isFrom ? valueFromInput  : ratedFromValue.toFixed(2))
                setFromInputState({
                    valueToShow: valueToShowFrom, value: ratedFromValue, error: currencyState.isFrom ? (currencyState.balance < ratedFromValue ? LESS_BALANCE_MSG: '') : ''
                });
                setToInputState({
                    valueToShow: (sellDirection ? '+' : '-') + (currencyState.isFrom ? ratedToValue.toFixed(2) : valueFromInput), value:ratedToValue, error: currencyState.isFrom ? '' : (currencyState.balance < ratedToValue ? LESS_BALANCE_MSG : '')
                });
            } else {
                currencyState.isFrom ? setFromInputState({
                    valueToShow: fromInputState.valueToShow, value: fromInputState.value, error: NUMBER_MSG
                }) : setToInputState({
                    valueToShow: toInputState.valueToShow, value: toInputState.value, error: NUMBER_MSG
                });
            }
        } else {
            setFromInputState({
                    valueToShow: '', value: 0, error: ''
                });
            setToInputState({
                valueToShow: '', value: 0, error: ''
            });
        }
    };

    const onFromMoneyBlur = (value: string) => {
        if(value.indexOf('.') >=0 && value.indexOf('.') === value.length-1) {
            setFromInputState({
                valueToShow: fromInputState.value.toString(), value: fromInputState.value, error: fromInputState.error
            });

        }
    }

    const onToMoneyBlur = (value: string) => {
        if(value.indexOf('.') >=0 && value.indexOf('.') === value.length-1) {
            setToInputState({
                valueToShow: toInputState.value.toString(), value: toInputState.value, error: toInputState.error
            });
        }
    }

    useEffect(() => {
        setFromInputState({
            valueToShow: '', value: 0, error: ''
        });
        setToInputState({
            valueToShow: '', value: 0, error: ''
        });
    }, [currencyToState, currencyFromState]);

    useEffect(() => {
        const noErrors = toInputState.error.length !== 0 || fromInputState.error.length !== 0;
        const nullValues = toInputState.value === 0 && fromInputState.value === 0;
        setDisabledSubmit(noErrors || nullValues);
    },[toInputState, toInputState]);

    return (
        <div>
            <AccountMoneyInput
                currencyState={currencyFromState}
                accounts={ accounts.filter((acc) => acc.currency !== currencyToState.currency)  }
                onCurrencyChange={(v) => onCurrencyChange(v, currencyFromState.isFrom)}
                inputState={fromInputState}
                onInputMoneyChange={onInputChange}
                onBlurMoneyInput={onFromMoneyBlur}
            />
            <div>
                <img
                    src={!sellDirection ? Icons.up : Icons.down}
                    width={32}
                    onClick={()=>setSellDirection(!sellDirection)}
                    alt={!sellDirection ? 'Up' : 'Down'}
                />
            </div>
            <AccountMoneyInput
                accounts={ accounts.filter((acc) => acc.currency !== currencyFromState.currency)}
                inputState={toInputState}
                currencyState={currencyToState}
                onCurrencyChange={(v: string) => onCurrencyChange(v, currencyToState.isFrom)}
                onInputMoneyChange={onInputChange}
                onBlurMoneyInput={onToMoneyBlur}
            />
            <div className={notification.className} data-testid={'notificationBlock'}>
                {notification.message}
            </div>
            <div>
                <button disabled={disabledSubmit} className={'ExchangeSubmit'} onClick={() => {
                    onSubmit(fromInputState.value, toInputState.value);
                    setFromInputState({
                        valueToShow: '', value: 0, error: ''
                    });
                    setToInputState({
                        valueToShow: '', value: 0, error: ''
                    });
                }}>
                    {`${sellDirection ? 'Sell ': 'Buy'} ${currencyFromState.currency} for ${currencyToState.currency}`}
                </button>
            </div>
        </div>
    )
}
