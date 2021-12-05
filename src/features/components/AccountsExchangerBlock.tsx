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
        if (valueFromInput !== "") {
            const reg = /^[+-]?\d+[.]?[\d]?[\d]?$/;
            if (reg.test(valueFromInput)) {
                valueFromInput = (valueFromInput.length > 1 && valueFromInput.match(/[+-]/) != null) ? valueFromInput.substring(1, valueFromInput.length) : valueFromInput;
                const input = parseFloat(parseFloat(valueFromInput).toFixed(2));
                if(input === 0) {
                    const nullReg = /^([0]?[.]?$)|^([0]?[.][0]?$)/;
                    if (!nullReg.test(valueFromInput)) {
                        valueFromInput = '0';
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
            currencyState.isFrom
                ? setFromInputState({
                    valueToShow: fromInputState.valueToShow, value: fromInputState.value, error: ''
                })
                : setToInputState({
                valueToShow: toInputState.valueToShow, value: toInputState.value, error: ''
            });
        }
    };

    const onFromMoneyBlur = (value: string) => {
        if(value.indexOf('.') >=0 && value.indexOf('.') === value.length-1) {
            const updatedValue = (parseInt(value)); //> 0 ? Number(value) : (-1* Number(value))).toString());
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
        onInputChange(toInputState.valueToShow, currencyToState);
    }, [currencyToState]);

    useEffect(() => {
        onInputChange(fromInputState.valueToShow, currencyFromState);
    }, [currencyFromState]);

    useEffect(() => {
        setDisabledSubmit(toInputState.error.length !== 0 || fromInputState.error.length !== 0 || toInputState.value === 0 && fromInputState.value === 0);
    },[toInputState, toInputState]);

    useEffect(() => {

        let current = toInputState.value;
        setToInputState({valueToShow: toInputState.valueToShow, value: toInputState.value, error: '' });
        if(current <= 0 && (current !== 0 && Number(currencyToState.balance.toFixed(2)) >= (-1*current))) {
            setToInputState({valueToShow: toInputState.valueToShow, value: toInputState.value, error: LESS_BALANCE_MSG });
        }
    }, [currencyToState.balance]);

    useEffect(() => {

        let current = fromInputState.value;
        setFromInputState({valueToShow: fromInputState.valueToShow, value: fromInputState.value, error: '' });
        if(current <= 0 && (current !== 0 && Number(currencyFromState.balance.toFixed(2)) >= (-1*current))) {
            setFromInputState({valueToShow: fromInputState.valueToShow, value: fromInputState.value, error: LESS_BALANCE_MSG });
        }
    }, [currencyFromState.balance]);


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
