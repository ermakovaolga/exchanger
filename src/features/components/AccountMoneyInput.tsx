import React, { ChangeEvent } from 'react';

import {AccountProps, CurrencyProps, InputMoneyProps, TEXT_COLOR, TEXT_ERROR_COLOR} from '../../core';

export  const AccountMoneyInput = (
    {
        onCurrencyChange,
        onInputMoneyChange,
        accounts,
        inputState,
        onBlurMoneyInput,
        currencyState,
    }: {
        currencyState: CurrencyProps,
        onCurrencyChange: (value: string, isFrom: boolean)=> void,
        onInputMoneyChange: (value: string, currencyState: CurrencyProps) => void,
        inputState: InputMoneyProps;
        accounts: AccountProps[];
        onBlurMoneyInput: (value: string) => void,
    }) => {


    return (
        <div className={"ExchangeBlock"}>
            <div  style={{display: 'flex', marginBottom: '4px'}}>
                <select
                    value={currencyState.currency}
                    onChange={(event:ChangeEvent<HTMLSelectElement>) => onCurrencyChange(event.target.value, false)}>
                    {accounts.map(i => {
                       return(<option className={"optionClass"} key={i.id} value={i.currency}>{i.currency}</option> );
                    })}
                </select>

                <input
                    placeholder={'0'}
                    className={'ExchangeBlockText'}
                    style={{color: !inputState.error.length ? TEXT_COLOR: (inputState.value === 0 ? TEXT_COLOR : TEXT_ERROR_COLOR)}}
                    type={'text'}
                    onBlur={(e: React.ChangeEvent<HTMLInputElement>)=> {
                        onBlurMoneyInput(e.target.value);
                    }}
                    maxLength={13}
                    value={inputState.valueToShow}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onInputMoneyChange(e.target.value, currencyState);
                    }}/>
            </div>
            <div  style={{display: 'flex'}}>
                <div className={'BalanceText'} data-testid={'balanceValue'}>
                    {`Balance: ${currencyState.balance.toFixed(2)}`}
                </div>
                {inputState.error.length > 0 && (<div className={'ErrorNotification'}>
                    {inputState.error}
                </div>)
                }
            </div>
        </div>
    );
}
