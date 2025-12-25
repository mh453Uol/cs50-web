import { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { isPwaInstalled } from '../../util/util';
import { isJummah, State } from '../Home/Home';
import { Tenant } from '../../models/Tenant';

const CarouselComponent = ({config, tenant}: { config: State, tenant: Tenant}) => {
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

    const onClickHandler = (url: string) => {
        window.location.href = url
    }


  const renderPWAInstructions = () => {
    if (browser === 'safari') {
      return (
        <img src="./img/safari.png" loading="lazy" className="img-fluid mx-auto d-block" alt="how to install app on safari"></img>
      );
    } else if (browser === 'chrome') {
      return (
        <img src="./img/chrome.png" loading="lazy" className="img-fluid mx-auto d-block" alt="how to install app on chrome"></img>
      );
    } else {
      return (
        <>
          <h5>How to Install PWA</h5>
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
      );
    }
  };

  return (
    <div data-testid="Carousel">
      <Carousel
        interval={null}
        controls={true}
        indicators={false}
        touch={true}
        variant="dark"
      >
        <Carousel.Item>
          <img className="img-fluid mx-auto d-block" src="./img/donation.png" loading="lazy" alt="donate to our mosque" 
            onClick={() => onClickHandler(tenant?.donationLink ?? "")}>
          </img>
        </Carousel.Item>
        {!isPwaInstalled() &&
          <Carousel.Item>
            {renderPWAInstructions()}
          </Carousel.Item>
        }
        {isJummah(config) && <Carousel.Item>
          <img className="img-fluid mx-auto d-block" src="./jummah-checklist-4.png" loading="lazy" alt="jummah sunnah checklist"></img>
        </Carousel.Item>
        }
        <Carousel.Item>
          <div className="text-center p-3">
            <h4>Upcoming Events</h4>
            <p>Join us for Friday Prayers, Islamic classes, and community events at our mosque!</p>
            <p>Stay connected and never miss an important event.</p>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
