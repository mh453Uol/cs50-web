import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AudioStream from './AudioStream';
import { FakeTenant } from '../../models/tests/FakeTenant';

describe('<AudioStream />', () => {
  test('it should mount', () => {
    const props = {
        stream: null,
        isLive: false,
        isLoading: true
    }
    render(<AudioStream tenant={new FakeTenant()}/>);
    
    const audioStream = screen.getByTestId('AudioStream');

    expect(audioStream).toBeInTheDocument();
  });
});