import {CURRENCIES} from "./types";

export const APP_ID = '069d3ff9a0fa422a9449ec04df281670';//'895106d24113470ca04f7db578020f42';//'542fc0052ef44b9b931071b5789aa5c2';
export const serverURL = 'https://openexchangerates.org/api';///latest.json
export const DELAY_POLLING = 10000;
export const DELAY_SUCCESS = 5000;

export const ACCOUNTS_INIT_VALUE = [
    {id:'1', currency: CURRENCIES.USD, balance: 1000.07},
    {id:'2', currency: CURRENCIES.GBP, balance: 3396.42677},
    {id:'3', currency: CURRENCIES.EUR, balance: 0},
    {id:'4', currency: CURRENCIES.RUB, balance: 300000.566}
    ];


export const TEXT_COLOR='#282c34';
export const TEXT_ERROR_COLOR='#d62424'
