import { useEffect, useState } from 'react';
import { Stream } from '../../models/Stream';
import { Link } from "react-router";
import { Tenant } from '../../models/Tenant';
import { isStreaming } from '../../services/prayertime/AudioStream.service';

import './LiveBanner.css';

interface Props {
  tenant: Tenant
}

interface StreamState {
  stream: Stream | null,
  isLive: boolean
}

const LiveBanner = ({ tenant }: Props) => {

  const [stream, setStream] = useState<StreamState>({ stream: null, isLive: false });

  const getStream = () => {
    isStreaming().then((data: Stream) => {
      setStream({
        stream: data,
        isLive: data.isLive,
      });
    })
  }

  useEffect(() => {
    getStream();
  }, [tenant.id]);

  if (stream.isLive) {
    return (
      <div data-testid="LiveBanner">
        <div className="alert alert-danger" role="alert">
          <div className="live-container">
            <div className="live-dot-container">
              <div className="live-dot"></div>
            </div>
            <div className="live-label">
              <Link to={`/radio/${tenant?.id}?utm_source=southcourtmosquedotlive&utm_medium=live-banner-home-page`}>
                {tenant?.name} is live now 🔊
              </Link>
            </div>
          </div>

        </div>
      </div>
    )
  } else {
    return <div data-testid="LiveBanner" />
  }
}
export default LiveBanner;
