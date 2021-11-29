import React, { useEffect } from 'react';
import Combobox from "react-widgets/Combobox";

import {AccountProps, CURRENCIES, RatesProps, TEXT_COLOR, TEXT_ERROR_COLOR} from '../../core';

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
        accounts
    }: {
        rates: RatesProps|null,
        value:  CURRENCIES,
        onCurrencyChange?: (value: string, isFrom: boolean, rates: RatesProps|null)=> void,
        balanceValue: number,
        inputMoneyValue: string,
        onInputMoneyChange?: (value: string) => void,
        valid: boolean,
        setAccountCount?: React.Dispatch<React.SetStateAction<number>>;
        setValid?: React.Dispatch<React.SetStateAction<boolean>>;
        accounts: AccountProps[];

    }) => {


    useEffect(() => {
        const current = Number(inputMoneyValue);
        if(current >= 0) {
            setValid?.(true);
        } else {
            setValid?.(current!== 0 && balanceValue > (-1*current));
        }

    }, [inputMoneyValue, balanceValue]);

    useEffect(() => {
        const selectedAccount = accounts.find(item => item.currency === value);
        if (selectedAccount) {
            setAccountCount?.(selectedAccount.balance);
        }
    },[value, accounts]);

   /* const opts: any = [];
    accounts.forEach(i => {
        opts.push((<option className={"optionClass"} value={i.currency}>{i.currency}</option> ));
    });*/
    return (
        <div className={"ExchangeBlock"}>
            <div  style={{display: 'flex'}}>
                {/*<select
                    value={value}
                    onChange={(event:ChangeEvent<HTMLSelectElement>) => onCurrencyChange?.(event.target.value, false, rates)}>
                    {opts}
                </select>*/}
                <Combobox
                    className={"ExchangeCombobox"}
                    onChange={(val: any) => onCurrencyChange?.(val.currency, false, rates)}
                    data={accounts}
                    dataKey='id'
                    value={value}
                    textField='currency'
                />
                <input
                    className={'ExchangeBlockText'}
                    style={{color: valid ? TEXT_COLOR: TEXT_ERROR_COLOR}}
                    type={'text'}
                    value={inputMoneyValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.stopPropagation();
                        onInputMoneyChange?.(e.target.value);
                    }}/>
            </div>
            <div className={"BalanceText"} data-testid={'balanceValue'}>
                {`Balance: ${balanceValue.toFixed(2)}`}
            </div>
        </div>
    );
}
