import React from 'react';
import { Stream } from '../../models/Stream';
import { Tenant } from '../../models/Tenant';
import { isStreaming } from '../../services/prayertime/AudioStream.service';

interface Props {
  tenant: Tenant
 }

interface State {
  stream: Stream | null,
  isLive: boolean,
  isLoading: boolean
}

class AudioStream extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      stream: null,
      isLive: false,
      isLoading: true
    }
  }

  componentDidMount() {
    this.getStream();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {

    if (this.props?.tenant && prevProps?.tenant) {
      if (prevProps.tenant.id !== this.props.tenant.id) {

        this.setState({
          stream: null,
          isLive: false,
          isLoading: true
        }, () => {
          this.getStream();
        })
      }
    }
  }

  getStream() {
    isStreaming().then((data: Stream) => {
      this.setState({
        stream: data,
        isLive: data.isLive,
        isLoading: false
      });
    })
  }

  getMessage() {
    if (this.state.isLoading) {
      return `Hang on, getting the audio stream for the ${this.props?.tenant?.name}`;
    }

    if (this.state.isLive) {
      return `Click play, to hear the audio stream for the ${this.props?.tenant?.name}`;
    }

    if (!this.state.isLive) {
      return `Sorry, ${this.props?.tenant?.name} has switched off the mic so the audio stream has ended`;
    }
  }

  async share() {
    if (navigator.share) {
      const url = window.location.href;
      const trackingUrl = `${url}?utm_source=southcourtmosquedotlive&utm_medium=share-radio-page`
      // Web Share API is supported

      try {
        await navigator.share({ title: 'Southcourt Masjid Radio', url: trackingUrl});
      } catch (e) {

      }
    }
  }

  navigateToHome() {
    window.location.href = "/?utm_source=southcourtmosquedotlive&utm_medium=see-salah-radio-page"
  }

  render() {
      return (
        <div data-testid="AudioStream">
          <div className="container mt-2">
            <div className="align-self-center mb-3">
              <p className="text-center">
                <b>{this.getMessage()}</b>
              </p>

              { this.state.isLoading &&
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }

              { this.state.isLive && 
                <div className="text-center">
                  <audio src={this.state.stream?.audioStreamUrl} controls autoPlay={true}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              }

              <div className="text-center">
                <div className="mt-3">
                  <button type="button" className="btn btn-sm btn-info" onClick={this.share}>
                    Share
                  </button>

                  <button type="button" className="btn btn-sm btn-info ml-2" onClick={this.navigateToHome}>
                    See Salah Times
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )
  }
}
export default AudioStream;

