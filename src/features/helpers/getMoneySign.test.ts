import {getMoneySign} from './getMoneySign';
import { CURRENCIES } from '../../core';
import Icons from '../components/Icons';

describe('getMoneySign', () => {
    it("should return dollar", () => {
        const currency = CURRENCIES.USD;
        expect(getMoneySign(currency)).toBe(Icons.dollar);
    });
    it("should return euro", () => {
        const currency = CURRENCIES.EUR;
        expect(getMoneySign(currency)).toBe(Icons.euro);
    });
    it("should return pound", () => {
        const currency = CURRENCIES.GBP;
        expect(getMoneySign(currency)).toBe(Icons.pound);
    });
    it("should return ruble", () => {
        const currency = CURRENCIES.RUB;
        expect(getMoneySign(currency)).toBe(Icons.ruble);
    });
})
