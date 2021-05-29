import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Announcements from './Announcement';

describe('<Announcement />', () => {
  test('it should mount', () => {
    render(<Announcements />);
    
    const announcement = screen.getByTestId('Announcement');

    expect(announcement).toBeInTheDocument();
  });
});