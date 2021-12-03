import React, { ChangeEvent, useEffect } from 'react';

import { AccountProps, CURRENCIES, RatesProps, TEXT_COLOR, TEXT_ERROR_COLOR } from '../../core';

export  const AccountMoneyInput = (
    {
        rates,
        value,
        onCurrencyChange,
        balanceValue,
        inputMoneyValue,
        onInputMoneyChange,
        valid,
        setValid,
        accounts,
        inputFromError,
        inputToError,
        onBlurMoneyInput,
    }: {
        rates: RatesProps|null,
        value:  CURRENCIES,
        onCurrencyChange?: (value: string, isFrom: boolean, rates: RatesProps|null)=> void,
        balanceValue: number,
        inputMoneyValue: string,
        onInputMoneyChange: (value: string) => void,
        valid: boolean,
        setValid?: React.Dispatch<React.SetStateAction<boolean>>;
        accounts: AccountProps[];
        inputFromError?:string;
        inputToError?:string;
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
            setValid?.(current !== 0 && balanceValue >= (-1*current));
        }

    }, [inputMoneyValue, balanceValue]);

    return (
        <div className={"ExchangeBlock"}>
            <div  style={{display: 'flex', marginBottom: '4px'}}>
                <select
                    value={value}
                    onChange={(event:ChangeEvent<HTMLSelectElement>) => onCurrencyChange?.(event.target.value, false, rates)}>
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
                        onInputMoneyChange?.(e.target.value);
                    }}/>
            </div>
            <div  style={{display: 'flex'}}>
                <div className={"BalanceText"} data-testid={'balanceValue'}>
                    {`Balance: ${balanceValue.toFixed(2)}`}
                </div>
                {inputFromError &&
                (<div className={"ErrorNotification"}>
                    {inputFromError}
                </div>)
                }
                {inputToError &&
                (<div className={"ErrorNotification"}>
                    {inputToError}
                </div>)
                }
            </div>


        </div>
    );
}
