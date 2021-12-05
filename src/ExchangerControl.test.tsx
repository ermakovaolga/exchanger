import { render, screen} from '@testing-library/react';
import React from 'react';
import userEvent  from '@testing-library/user-event';

import ExchangerControl from './ExchangerControl';
import {AccountMoneyInput, AccountsExchangerBlock } from './features/components';
import { ACCOUNTS_INIT_VALUE, APP_ID, CURRENCIES, serverURL } from './core';


describe('test ExchangerControl', () => {
  test('renders submit btn', async () => {
    render(<ExchangerControl/>);
    const linkElement = screen.getByText('Sell USD for EUR');

    await expect(linkElement).toBeInTheDocument();
    await expect(linkElement).toBeDisabled();
    await userEvent.click(screen.getByAltText('Down'));
    const message = await screen.getByText('Buy USD for EUR');

    expect(message).toBeInTheDocument();
  });

  test('renders header text', async () => {
    render(<ExchangerControl/>);

    const linkElementByText = screen.getByText('Sell USD');
    expect(linkElementByText).toBeInTheDocument();

    await userEvent.click(screen.getByAltText('Down'));
    const message = await screen.getByText('Buy USD');

    expect(message).toBeInTheDocument();
  });

  test('renders default values', async () => {
    const INIT_VALUE ={
      currency: CURRENCIES.USD,
      isFrom: true, rate: 1,
      balance: 1000.7888
    };
    const INIT_INPUT_VALUE = {
      value: 10,
      valueToShow: '-10',
      error: ''
    }
    render(<AccountMoneyInput
        accounts={ ACCOUNTS_INIT_VALUE }
        currencyState={INIT_VALUE}
        inputState={INIT_INPUT_VALUE}
        onBlurMoneyInput={() => {}}
        onCurrencyChange={() => {}}
        onInputMoneyChange={() => {}}
    />);

    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeInTheDocument();

    const inputFrom = screen.getByDisplayValue('-10');
    expect(inputFrom).toBeInTheDocument();

    const balanceText = screen.getByTestId('balanceValue');
    expect(balanceText).toBeInTheDocument();
    await expect(balanceText).toHaveTextContent('Balance: 1000.79');

  });

  test('renders AccountBlock', async () => {
    const INIT_CURRENCY_FROM ={
      currency: CURRENCIES.USD,
      isFrom: true, rate: 1,
      balance: 1000.7888
    };
    const INIT_CURRENCY_TO = {
      currency: CURRENCIES.EUR,
      isFrom: false, rate: 0.8,
      balance: 10
    }
    render(<AccountsExchangerBlock
        accounts={ ACCOUNTS_INIT_VALUE }
        onCurrencyChange={() => {}}
        sellDirection={true}
        setSellDirection={() => {}}
        currencyFromState={INIT_CURRENCY_FROM}
        currencyToState={INIT_CURRENCY_TO}
        notification={{className: '', message: ''}}
        onSubmit={() => {}}
    />);

    const combobox = screen.getAllByRole('combobox');
    expect(combobox).toHaveLength(2)


    const balanceText = screen.getAllByTestId('balanceValue');
    expect(balanceText).toHaveLength(2);
    await expect(balanceText[0]).toHaveTextContent('Balance: 1000.79');
    await expect(balanceText[1]).toHaveTextContent('Balance: 10');

  });

  test('tests currency change', async () => {

    render(<ExchangerControl/>);
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes).toHaveLength(2);

    const input = screen.getAllByPlaceholderText('0');
    expect(input[0]).toBeInTheDocument();
    const inputTo = input[1];
    expect(inputTo).toBeInTheDocument();

    const balanceTexts = screen.getAllByTestId('balanceValue');
    await expect(balanceTexts).toHaveLength(2);
    await expect(balanceTexts[0]).toHaveTextContent('Balance: 0.00');

  });

  test('tests fail request', async () => {
    const fetchMock = require('fetch-mock');
    const myMock = fetchMock.sandbox().mock(`${serverURL}/latest.json`, {
      status: 403
    });
    render(<ExchangerControl/>);
    const linkElementByText = await screen.findByTestId('notificationBlock');
    await expect(linkElementByText).toBeInTheDocument();
    setTimeout(() => {
      expect(myMock.called()).toBe(true);
    }, 10000);
  });

  test('tests 200 request', async () => {
    const fetchMock = require('fetch-mock');
    const myMock = fetchMock.sandbox().mock(`${serverURL}/latest.json?api_id=${APP_ID}`, {
      status: 200
    });
    render(<ExchangerControl/>);
    const linkElementByText = await screen.findByTestId('notificationBlock');
    await expect(linkElementByText).toBeInTheDocument();
    setTimeout(() => {
      expect(myMock.called()).toBe(true);
    }, 1000);
  });
})
