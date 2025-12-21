import { useState, useEffect } from 'react';

const BookmarkInstruction = () => {
  const [browser, setBrowser] = useState('');

  useEffect(() => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      setBrowser('chrome');
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      setBrowser('safari');
    } else {
      setBrowser('other');
    }
  }, []);

  return (
    <div data-testid="BookmarkInstruction">
      <div className="m-2">
        <p className="text-center bold">
          To install this app on your home screen
        </p>

        {browser === 'safari' && (
          <>
            <ol>
              <li>Tap the Share button (square with upward arrow)</li>
              <li>Tap "Add to Home Screen"</li>
              <li>Enter a name and tap Add</li>
            </ol>
          </>
        )}

        {browser === 'chrome' && (
          <>
            <ol>
              <li>Tap the menu button (three dots ⋮ in the top right)</li>
              <li>Tap "Install app"</li>
            </ol>
          </>
        )}

        {browser === 'other' && (
          <>
            <p>For Safari:</p>
            <ol>
              <li>Tap the Share icon</li>
              <li>Tap "Add to Home Screen"</li>
              <li>Enter a name for the bookmark</li>
            </ol>

            <p>For Chrome:</p>
            <ol>
              <li>Tap the menu button (three dots ⋮ in the top right)</li>
              <li>Tap "Install app"</li>
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
export default BookmarkInstruction;
