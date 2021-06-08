import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BookmarkInstruction from './BookmarkInstruction';

describe('<BookmarkInstruction />', () => {
  test('it should mount', () => {
    render(<BookmarkInstruction />);
    
    const bookmarkInstruction = screen.getByTestId('BookmarkInstruction');

    expect(bookmarkInstruction).toBeInTheDocument();
  });
});