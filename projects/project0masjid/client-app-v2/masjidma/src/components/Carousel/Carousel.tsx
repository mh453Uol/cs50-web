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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const eidTiming = (tenant: Tenant) => {
    if (tenant.id === 3) {
      const content = () => <img className="img-fluid mx-auto d-block" src="./img/eid-prayer-aylesbury-mosque-26.webp" loading="lazy" alt="aylesbury mosque eid timing" />
      return content;
    }

    const content = () => <img className="img-fluid mx-auto d-block" src="./img/eid-prayer-southcourt-26.webp" loading="lazy" alt="southcourt mosque eid timing" />
    return content;
  }

  const carouselItems = [
    isJummah(config) ? {
      content: () => <img className="img-fluid mx-auto d-block" src="./jummah-checklist-4.png" loading="lazy" alt="jummah sunnah checklist" />,
      key: '1',
    } : undefined,
    {
      content: () => <img className="img-fluid mx-auto d-block" src="./img/donation.webp" loading="lazy" alt="donate to our mosque" onClick={() => onClickHandler(tenant?.donationLink ?? "")} />,
      key: '2',
    },
    !isPwaInstalled() ? { key: '3', content: () => renderPWAInstructions() } : undefined
  ].filter((item) => item)

  return (
    <div data-testid="Carousel">
      <Carousel
        interval={null}
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
