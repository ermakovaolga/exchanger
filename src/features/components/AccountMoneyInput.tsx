import React, { ChangeEvent, useEffect } from 'react';

import { AccountProps, CurrencyProps, TEXT_COLOR, TEXT_ERROR_COLOR } from '../../core';

export  const AccountMoneyInput = (
    {
        onCurrencyChange,
        inputMoneyValue,
        onInputMoneyChange,
        valid,
        setValid,
        accounts,
        onBlurMoneyInput,
        currencyState,inputError,
    }: {
        currencyState: CurrencyProps,
        onCurrencyChange?: (value: string, isFrom: boolean)=> void,
        inputMoneyValue: string,
        onInputMoneyChange?: (value: string, currencyState: CurrencyProps) => void,
        valid: boolean,
        setValid?: React.Dispatch<React.SetStateAction<boolean>>;
        accounts: AccountProps[];
        inputError?:string;
        onBlurMoneyInput?: (value: string) => void,
    }) => {

    useEffect(() => {
        let current = Number(inputMoneyValue);
        if(current === -0) {
            current = 0;
        }
        if(current > 0) {
            setValid?.(true);
        } else {
            setValid?.(current !== 0 && Number(currencyState.balance.toFixed(2)) >= (-1*current));
        }

    }, [inputMoneyValue, currencyState.balance]);

    return (
        <div className={"ExchangeBlock"}>
            <div  style={{display: 'flex', marginBottom: '4px'}}>
                <select
                    value={currencyState.currency}
                    onChange={(event:ChangeEvent<HTMLSelectElement>) => onCurrencyChange?.(event.target.value, false)}>
                    {accounts.map(i => {
                       return(<option className={"optionClass"} key={i.id} value={i.currency}>{i.currency}</option> );
                    })}
                </select>

                <input
                    placeholder={'0'}
                    className={'ExchangeBlockText'}
                    style={{color: valid ? TEXT_COLOR: (inputMoneyValue === '0' ? TEXT_COLOR : TEXT_ERROR_COLOR)}}
                    type={'text'}
                    onBlur={(e: React.ChangeEvent<HTMLInputElement>)=> {
                        onBlurMoneyInput?.(e.target.value);
                    }}
                    maxLength={13}
                    value={inputMoneyValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onInputMoneyChange?.(e.target.value, currencyState);
                    }}/>
            </div>
            <div  style={{display: 'flex'}}>
                <div className={"BalanceText"} data-testid={'balanceValue'}>
                    {`Balance: ${currencyState.balance.toFixed(2)}`}
                </div>
                {inputError && (<div className={"ErrorNotification"}>
                    {inputError}
                </div>)
                }
            </div>
        </div>
    );
}
