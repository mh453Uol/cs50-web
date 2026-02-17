import { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { isPwaInstalled } from '../../util/util';
import { isJummah, State } from '../Home/Home';
import { Tenant } from '../../models/Tenant';

const CarouselComponent = ({ config, tenant }: { config: State, tenant: Tenant }) => {
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
        <img src="./img/safari.webp" loading="lazy" className="img-fluid mx-auto d-block" alt="how to install app on safari" />
      );
    }

    return (
      <img src="./img/chrome.webp" loading="lazy" className="img-fluid mx-auto d-block" alt="how to install app on chrome" />
    );
  };

  const carouselItems = [
    { 
      content: () => <img className="img-fluid mx-auto d-block" src="./img/taraweeh-banner-ay-26.png" loading="lazy" alt="taraweeh prayer invitation" onClick={() => onClickHandler('ramadan')} />,
      key: '-1', 
    },
    isJummah(config) ? {
      content: () => <img className="img-fluid mx-auto d-block" src="./jummah-checklist-4.png" loading="lazy" alt="jummah sunnah checklist" />,
      key: '1',
    }: undefined,
    { 
      content: () => <img className="img-fluid mx-auto d-block" src="./img/quran-challenge.png" loading="lazy" alt="finish quran in ramadan" onClick={() => onClickHandler(tenant?.donationLink ?? "")} />,
      key: '0', 
    },
    { 
      content: () => <img className="img-fluid mx-auto d-block" src="./img/donation.webp" loading="lazy" alt="donate to our mosque" onClick={() => onClickHandler(tenant?.donationLink ?? "")} />,
      key: '2', 
    },
    !isPwaInstalled() ? { key: '3', content: () => renderPWAInstructions() } : undefined
  ].filter((item) => item)

  return (
    <div data-testid="Carousel">
      <Carousel
        interval={2000}
        controls={carouselItems.length > 1}
        indicators={false}
        touch={true}
        variant="dark"
      >
        {carouselItems.map((config) => 
          <Carousel.Item key={config?.key}>
            {config && config.content()}
          </Carousel.Item>
        )}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
