import {CURRENCIES} from "./types";

export const APP_ID = '33aa1c2995cf4d16bf41ba1f4b3382c3';
export const serverURL = 'https://openexchangerates.org/api';
export const DELAY_POLLING = 10000;
export const DELAY_SUCCESS = 5000;

export const ACCOUNTS_INIT_VALUE = [
    {id:'1', currency: CURRENCIES.USD, balance: 1000.07},
    {id:'2', currency: CURRENCIES.GBP, balance: 3396.42677},
    {id:'3', currency: CURRENCIES.EUR, balance: 0},
    {id:'4', currency: CURRENCIES.RUB, balance: 300000.566}
    ];

export const TEXT_COLOR='#282c34';
export const TEXT_ERROR_COLOR='#d62424';

export const LESS_BALANCE_MSG = 'The value should be less than balance';
export const NUMBER_MSG = 'Enter number with two decimals';
