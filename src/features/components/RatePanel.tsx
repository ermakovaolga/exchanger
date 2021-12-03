import React from 'react';

import { getMoneySign } from '../helpers';
import { CurrencyProps } from '../../core';

export const RatePanel = (
    {
        currencyState,
        text,
    }: {
        currencyState: CurrencyProps;
        text: string;
    }
) => (
        <div>
            <img
                style={{width: '16px', position:'relative', top: '1px', margin: '0 2px 0 4px'} }
                alt={currencyState.currency}
                src={getMoneySign(currencyState.currency)}
            />
            {text}
        </div>
    );
