import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from './Header';

describe('<Header />', () => {
  test('it should mount', () => {
    const noop = () => {};

    render(<Header 
      date={new Date()} 
      isLoading={false} 
      onYesterdayClick={noop} 
      onTomorrowClick={noop }/>);
    
    const header = screen.getByTestId('Header');

    expect(header).toBeInTheDocument();
  });
});