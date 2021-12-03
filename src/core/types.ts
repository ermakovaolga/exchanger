export interface AccountProps {
    id:string;
    currency: string;
    balance: number;
}

export enum CURRENCIES {
    'USD'='USD',
    'EUR'='EUR',
    'GBP'='GBP',
    'RUB'='RUB'
}

export type RatesProps = {
    [details in keyof typeof CURRENCIES]: number;
};

export interface RatesResponceProps {
    base?: CURRENCIES;
    disclaimer?: string;
    license?: string;
    rates?: RatesProps,
    timestamp?: number;
}

export interface CurrencyProps {
    isFrom: boolean;
    rate: number;
    balance: number;
    currency: CURRENCIES;
}
