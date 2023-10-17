import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Navigation from './Navigation';
import { FakeTenant } from '../../models/tests/FakeTenant';

describe('<Navigation />', () => {
  test('it should mount', () => {
    render(<Navigation 
      children={null}
      onTenantSelected={() => {}}
      tenants={[new FakeTenant()]}/>);
    
    const navigation = screen.getByTestId('Navigation');

    expect(navigation).toBeInTheDocument();
  });
});