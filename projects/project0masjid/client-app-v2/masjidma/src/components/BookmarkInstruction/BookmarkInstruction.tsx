import React from 'react';


const BookmarkInstruction: React.FC = () => (
  <div data-testid="BookmarkInstruction">
    <div className="m-2">
      <p className="text-center">
        <b>Follow these instructions to add this page to your phones home screen</b>
      </p>

      <div className="text-center">
        <b>iPhone</b>
      </div>

      <ol>
        <li>Tap the Share icon</li>
        <li>Tap add to Home Screen</li>
        <li>Enter name for bookmark</li>
      </ol>

      <div className="text-center">
        <b>Android</b>
      </div>

      <ol>
        <li>Tap the menu icon (3 dots in upper right-hand corner)</li>
        <li>Tap install app</li>
      </ol>
    </div>
  </div>
);

export default BookmarkInstruction;
