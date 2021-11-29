import { render, screen} from '@testing-library/react';
import React from "react";
import userEvent  from '@testing-library/user-event';

import App from './App';
import {AccountMoneyInput} from './features/components/AccountMoneyInput';
import {ACCOUNTS_INIT_VALUE, APP_ID, CURRENCIES, serverURL} from './core';


describe('test App', () => {
  test('renders submit btn', async () => {
    render(<App/>);
    const linkElement = screen.getByText('Sell USD for EUR');

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toBeDisabled();
    await userEvent.click(screen.getByAltText('Down'));
    const message = await screen.getByText('Buy USD for EUR');

    expect(message).toBeInTheDocument();
  });

  test('renders header text', async () => {
    render(<App/>);

    const linkElementByText = screen.getByText('Sell USD');
    expect(linkElementByText).toBeInTheDocument();

    await userEvent.click(screen.getByAltText('Down'));
    const message = await screen.getByText('Buy USD');

    expect(message).toBeInTheDocument();
  });

  test('renders default values', async () => {
    const RATES_INIT_VALUE = { USD: 2,
          GBP: 4,
          EUR: 1,
          RUB: 7
        };
    const balance = 1000.7888;
    render(<AccountMoneyInput
        accounts={ ACCOUNTS_INIT_VALUE }
        rates={RATES_INIT_VALUE}
        value={CURRENCIES.USD}
        balanceValue={balance}
        valid={true}
        inputMoneyValue={'-10'}
    />);

    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeInTheDocument();
    await expect(combobox.getAttribute('value')).toBe('USD');

    const inputFrom = screen.getByDisplayValue('-10');
    expect(inputFrom).toBeInTheDocument();

    const balanceText = screen.getByTestId('balanceValue');
    expect(balanceText).toBeInTheDocument();
    await expect(balanceText).toHaveTextContent('Balance: 1000.79');

  });

  test('tests currency change', async () => {

    render(<App/>);
    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes).toHaveLength(2);

    const input = screen.getByDisplayValue('-0.00');
    expect(input).toBeInTheDocument();
    const inputTo = screen.getByDisplayValue('+0.00');
    expect(inputTo).toBeInTheDocument();

    const balanceTexts = screen.getAllByTestId('balanceValue');
    await expect(balanceTexts).toHaveLength(2);
    await expect(balanceTexts[0]).toHaveTextContent('Balance: 1000.07');

  });

  test('tests fail request', async () => {
    const fetchMock = require('fetch-mock');
    const myMock = fetchMock.sandbox().mock(`${serverURL}/latest.json`, {
      status: 403
    });
    render(<App/>);
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
    render(<App/>);
    const linkElementByText = await screen.findByTestId('notificationBlock');
    await expect(linkElementByText).toBeInTheDocument();
    setTimeout(() => {
      expect(myMock.called()).toBe(true);
    }, 1000);
  });
})
