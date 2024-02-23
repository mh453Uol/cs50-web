import { useRef, useState } from 'react';
import { Stream } from '../../models/Stream';
import { Tenant } from '../../models/Tenant';
import { isStreaming } from '../../services/prayertime/AudioStream.service';
import styles from './AudioStream.module.css';
import PlayButton from './PlayButton/PlayButton';
import PauseButton from './PauseButton/PauseButton';
import LiveBanner from '../LiveBanner/LiveBanner';
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
  const [message, setMessage] = useState('');
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  const getStream = async () => {
    let data = await isStreaming();

    setStream({
      data,
      isLive: data.isLive,
      isLoading: true,
    });

    if (data.isLive) {
      setMessage('');
    }

    if (!data.isLive) {
      setMessage(`Waiting for ${props.tenant?.name} to turn the mic on...`);
    }

    return data;
  }

  const onPlayAudio = (stream: Stream) => {
    if (audio.current) {
      audio.current.src = stream.audioStreamUrl;
      audio.current.play().catch((e) => {
        onPause();
      });
    }
  }

  const poll = async () => {
    const stream = await getStream();
    if (stream.isLive) {
      onPlayAudio(stream);
    }
    if (!stream.isLive) {
      const interval = setInterval(async () => {
        const stream = await getStream();
        if (stream.isLive) {
          onPlayAudio(stream);
          clearInterval(interval);
        }
      }, 1000 * 3);
    }
  }

  async function share() {
    if (navigator.share) {
      const url = window.location.href;
      const trackingUrl = `${url}?utm_source=southcourtmosquedotlive&utm_medium=share-radio-page`
      // Web Share API is supported
      try {
        await navigator.share({ title: 'Southcourt Masjid Radio', url: trackingUrl });
      } catch (e) { }
    }
  }

  const navigateToHome = () => {
    window.location.href = '/?utm_source=southcourtmosquedotlive&utm_medium=see-salah-radio-page';
  }

  const onPlay = () => {
    setPlaying(() => true);
    setMessage(`Hang on, getting the audio stream for the ${props.tenant?.name}`);
    poll();
  }

  const onPause = () => {
    setPlaying(() => false);
    setStream(() => { return { data: null, isLive: false, isLoading: true } });
    setMessage(() => '');
    if (audio.current) {
      audio.current.pause();
    }
  }

  return (
    <div data-testid='AudioStream'>
      <LiveBanner tenant={props.tenant} />

      <div className="container mt-2">
        <div className="align-self-center mb-3">
          <p className="text-center mb-0">
            <b>{message}</b>
          </p>

          <audio preload="auto" ref={audio}></audio>

          {/* Render play button */}

          {
            !playing && <div className=" d-flex justify-content-center">
              <div className={styles['button-container']} onClick={onPlay}>
                <PlayButton />
              </div>
            </div>
          }

          {
            playing && <div className=" d-flex justify-content-center">
              {!stream.isLive &&
                <div className="spinner-border mt-2" role="status">
                  <span className="sr-only">Loading...</span>
                </div >
              }
              {
                stream.isLive &&
                <div className={styles['button-container']} onClick={onPause}>
                  <PauseButton />
                </div>
              }
            </div >
          }

          <div className="text-center">
            <div className="mt-3">
              <button type="button" className="btn btn-sm btn-info" onClick={share}>
                Share
              </button>
              <button type="button" className="btn btn-sm btn-info ml-2" onClick={navigateToHome}>
                See Salah Times
              </button>
            </div >
          </div >
        </div >
      </div >
    </div >
  );
};
export default AudioStream;