import { CURRENCIES } from '../../core';
import Icons from '../components/Icons';

export const getMoneySign = (currency: CURRENCIES) => {
    switch(currency) {
        case(CURRENCIES.EUR):  {
            return Icons.euro;
        }
        case CURRENCIES.GBP: {
            return Icons.pound;
        }
        case CURRENCIES.USD: {
            return Icons.dollar;
        }
        case CURRENCIES.RUB: {
            return Icons.ruble;
        }
    }
}
