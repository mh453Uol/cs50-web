import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Ramadan from './Ramadan';
import { FakeTenant } from '../../models/tests/FakeTenant';

describe('<Ramadan />', () => {
  test('it should mount', () => {
    render(<Ramadan tenant={new FakeTenant()} />);
    
    const ramadan = screen.getByTestId('Ramadan');

    expect(ramadan).toBeInTheDocument();
  });
});