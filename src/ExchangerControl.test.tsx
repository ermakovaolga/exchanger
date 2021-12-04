import { render, screen} from '@testing-library/react';
import React from "react";
import userEvent  from '@testing-library/user-event';

import ExchangerControl from './ExchangerControl';
import { AccountMoneyInput } from './features/components';
import { ACCOUNTS_INIT_VALUE, APP_ID, CURRENCIES, serverURL } from './core';


describe('test App', () => {
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
      balance: 1000.7888};
    render(<AccountMoneyInput

        accounts={ ACCOUNTS_INIT_VALUE }
        currencyState={INIT_VALUE}
        valid={true}
        inputMoneyValue={'-10'}
    />);

    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeInTheDocument();

    const inputFrom = screen.getByDisplayValue('-10');
    expect(inputFrom).toBeInTheDocument();

    const balanceText = screen.getByTestId('balanceValue');
    expect(balanceText).toBeInTheDocument();
    await expect(balanceText).toHaveTextContent('Balance: 1000.79');

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