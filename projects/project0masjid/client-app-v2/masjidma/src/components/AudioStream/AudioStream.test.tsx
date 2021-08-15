import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AudioStream from './AudioStream';

describe('<AudioStream />', () => {
  test('it should mount', () => {
    render(<AudioStream />);
    
    const audioStream = screen.getByTestId('AudioStream');

    expect(audioStream).toBeInTheDocument();
  });
});