import React, {ChangeEvent, useEffect} from 'react';

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
        setAccountCount,
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
        setAccountCount?: React.Dispatch<React.SetStateAction<number>>;
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
            setValid?.(current === 0 || balanceValue > (-1*current));
        }

    }, [inputMoneyValue, balanceValue]);


    useEffect(() => {
        const selectedAccount = accounts.find(item => item.currency === value);
        if (selectedAccount) {
            setAccountCount?.(selectedAccount.balance);
        }
    },[value, accounts]);

    const opts: any = [];
    accounts.forEach(i => {
        opts.push((<option className={"optionClass"} value={i.currency}>{i.currency}</option> ));
    });

    return (
        <div className={"ExchangeBlock"}>
            <div  style={{display: 'flex'}}>
                <select
                    value={value}
                    onChange={(event:ChangeEvent<HTMLSelectElement>) => onCurrencyChange?.(event.target.value, false, rates)}>
                    {opts}
                </select>

                <input
                    className={'ExchangeBlockText'}
                    style={{color: valid ? TEXT_COLOR: (inputMoneyValue === '0' ? TEXT_COLOR : TEXT_ERROR_COLOR)}}
                    type={'text'}
                    onBlur={(e: React.ChangeEvent<HTMLInputElement>)=> {
                        onBlurMoneyInput?.(e.target.value);
                    }}
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
