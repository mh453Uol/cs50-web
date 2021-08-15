import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LiveBanner from './LiveBanner';

describe('<LiveBanner />', () => {
  test('it should mount', () => {
    render(<LiveBanner />);
    
    const liveBanner = screen.getByTestId('LiveBanner');

    expect(liveBanner).toBeInTheDocument();
  });
});