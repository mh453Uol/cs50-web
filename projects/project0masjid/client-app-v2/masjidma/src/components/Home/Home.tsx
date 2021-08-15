import React from 'react';

import Header from '../../components/Header/Header';

import { Tenant } from '../../models/Tenant';
import { addDays, getBrowserVisibilityProp } from '../../util/util';
import { getJamaatTimes, getPrayerStartTimes } from '../../services/prayertime/Prayertime.service';

import { JamaatTime } from '../../models/JamaatTime';
import { PrayerTime } from '../../models/PrayerTime';
import Table from '../../components/Table/Table';
import BookmarkInstruction from '../../components/BookmarkInstruction/BookmarkInstruction';
import Announcements from '../Announcement/Announcement';
import LiveBanner from '../LiveBanner/LiveBanner';

interface Props {
  tenant: Tenant
}

interface State {
  date: Date,
  tenant: Tenant,
  isLoading: boolean,
  salah?: {
    jamaat: JamaatTime,
    start: PrayerTime
  }
}

class Home extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: true,
      date: new Date(),
      tenant: props.tenant,
    }

    this.onYesterdayClick = this.onYesterdayClick.bind(this);
    this.onTomorrowClick = this.onTomorrowClick.bind(this);

    this.onVisibilityChange = this.onVisibilityChange.bind(this);

  }

  getSalahTime(): Promise<[JamaatTime, PrayerTime]> {
    this.setState({
      isLoading: true
    });

    return Promise.all([
      getJamaatTimes(this.state.date),
      getPrayerStartTimes(this.state.date),
    ]);
  }

  setSalahTime() {
    this.getSalahTime()
      .then(([jamaat, startTime]) => {

        this.setState({
          isLoading: false,
          salah: {
            jamaat: jamaat,
            start: startTime
          }
        })
      });
  }

  onVisibilityChange() {
    if (document.visibilityState === 'visible') {

      if (this.state.salah) {

        // When the browser tab is visible set the salah state causing a rerender of the header and table
        // which will update the next salah.
        this.setState({
          salah: {
            jamaat: this.state.salah.jamaat,
            start: this.state.salah.start
          }
        });
      }
    }
  }


  componentDidMount() {

    this.setSalahTime();

    const visibilityChange = getBrowserVisibilityProp();

    document.addEventListener(visibilityChange, this.onVisibilityChange);
  }

  componentWillUnmount() {
    const visibilityChange = getBrowserVisibilityProp();

    document.removeEventListener(visibilityChange, this.onVisibilityChange)
  }

  componentDidUpdate(prevProps: Props, prevState: State) {

    if (this.props?.tenant && prevProps?.tenant) {
      if (prevProps.tenant.id !== this.props.tenant.id) {

        this.setState({
          isLoading: true,
          salah: undefined
        }, () => {
          this.setSalahTime();
        })
      }
    }
  }

  onYesterdayClick() {
    const yesterday = addDays(-1, this.state.date);

    this.setState({
      date: yesterday,
      salah: undefined
    }, () => {
      this.componentDidMount();
    });
  }

  onTomorrowClick() {
    const tomorrow = addDays(1, this.state.date);

    this.setState({
      date: tomorrow,
      salah: undefined
    }, () => {
      this.componentDidMount();
    });
  }

  render() {
    return (
      <div data-testid="Home">
        <LiveBanner
          tenant={this.props.tenant}>
        </LiveBanner>
        
        <Announcements
          tenant={this.props.tenant}
          date={this.state.date}>
        </Announcements>

        <Header
          date={this.state.date}
          isLoading={this.state.isLoading}
          salah={this.state.salah}
          onYesterdayClick={this.onYesterdayClick}
          onTomorrowClick={this.onTomorrowClick}>
        </Header>

        <Table
          salah={this.state.salah}>
        </Table>

        <BookmarkInstruction></BookmarkInstruction>
      </div>
    );
  }
}

export default Home;
