import React, { useEffect, useState } from 'react';
import { Stream } from '../../models/Stream';
import { Tenant } from '../../models/Tenant';
import { isStreaming } from '../../services/prayertime/AudioStream.service';

interface Props {
  tenant: Tenant
}

interface StreamState {
  data: Stream | null,
  isLive: boolean,
  isLoading: boolean
}

const AudioStream = (props: Props) => {
  const [stream, setStream] = useState<StreamState>({ data: null, isLive: false, isLoading: true });
  const [message, setMessage] = useState(`Hang on, getting the audio stream for the ${props.tenant?.name}`);

  useEffect(() => {
    isStreaming().then((data: Stream) => {
      setStream({
        data,
        isLive: data.isLive,
        isLoading: false,
      });

      if (data.isLive) {
        setMessage(`Click play, to hear the audio stream for the ${props.tenant?.name}`);
      }
  
      if (!data.isLive) {
        setMessage(`Sorry, ${props.tenant?.name} has switched off the mic so the audio stream has ended`);
      }
    })
  }, [props.tenant.name]);


  async function share() {
    if (navigator.share) {
      const url = window.location.href;
      const trackingUrl = `${url}?utm_source=southcourtmosquedotlive&utm_medium=share-radio-page`
      // Web Share API is supported

      try {
        await navigator.share({ title: 'Southcourt Masjid Radio', url: trackingUrl });
      } catch (e) {

      }
    }
  }

  const navigateToHome = () => {
    window.location.href = "/?utm_source=southcourtmosquedotlive&utm_medium=see-salah-radio-page"
  }

  return (
    <div data-testid="AudioStream">
      <div className="container mt-2">
        <div className="align-self-center mb-3">
          <p className="text-center">
            <b>{message}</b>
          </p>

          {stream.isLoading &&
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          }

          {stream.isLive &&
            <div className="text-center">
              <audio src={stream?.data?.audioStreamUrl} controls autoPlay={true}>
                Your browser does not support the audio element.
              </audio>
            </div>
          }

          <div className="text-center">
            <div className="mt-3">
              <button type="button" className="btn btn-sm btn-info" onClick={share}>
                Share
              </button>

              <button type="button" className="btn btn-sm btn-info ml-2" onClick={navigateToHome}>
                See Salah Times
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default AudioStream;

