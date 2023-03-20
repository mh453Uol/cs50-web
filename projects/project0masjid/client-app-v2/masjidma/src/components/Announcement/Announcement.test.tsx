import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Announcements from './Announcement';
import { Tenant } from '../../models/Tenant';
import { Announcement } from '../../models/Annoucement';
import { FakeTenant } from '../../models/tests/FakeTenant';

describe('<Announcement />', () => {
  test('it should mount', () => {
    const fakeTenant = new FakeTenant();

    render(<Announcements tenant={fakeTenant} date = {new Date()}/>);
    
    const announcement = screen.getByTestId('Announcement');

    expect(announcement).toBeInTheDocument();
  });
});