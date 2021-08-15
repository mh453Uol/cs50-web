import React from 'react';
import { Stream } from '../../models/Stream';
import { Link } from "react-router-dom";
import { Tenant } from '../../models/Tenant';
import { isStreaming } from '../../services/prayertime/AudioStream.service';

import './LiveBanner.css';

interface Props { 
  tenant: Tenant
}

interface State {
  stream: Stream | null,
  isLive: boolean
}

class LiveBanner extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      stream: null,
      isLive: false
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
      });
    })
  }


  render() {      

    if (this.state.isLive) {
      return (
        <div data-testid="LiveBanner">
          <div className="live-container">
            <div className="live-dot-container">
              <div className="live-dot"></div>
            </div>
            <div className="live-label">
                <Link to={`/radio/${this.props.tenant?.id}`}>Live</Link>
            </div>
          </div>
        </div>
      )
    } else {
      return ''
    }
  }
}
export default LiveBanner;
