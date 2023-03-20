import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LiveBanner from './LiveBanner';
import { FakeTenant } from '../../models/tests/FakeTenant';

describe('<LiveBanner />', () => {
  test('it should mount', () => {
    render(<LiveBanner tenant={new FakeTenant()} />);
    
    const liveBanner = screen.getByTestId('LiveBanner');

    expect(liveBanner).toBeInTheDocument();
  });
});