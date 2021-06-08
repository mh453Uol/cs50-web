import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NextSalah from './NextSalah';

describe('<NextSalah />', () => {
  test('it should mount', () => {
    render(<NextSalah />);
    
    const nextSalah = screen.getByTestId('NextSalah');

    expect(nextSalah).toBeInTheDocument();
  });
});