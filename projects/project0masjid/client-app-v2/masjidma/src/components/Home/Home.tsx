import React from 'react';

import Header from '../../components/Header/Header';

import configuration from '../../config/config.prod.json';
import { Tenant } from '../../models/Tenant';
import { addDays } from '../../util/util';
import { getJamaatTimes, getPrayerStartTimes } from '../../services/prayertime/Prayertime.service';

import { JamaatTime } from '../../models/JamaatTime';
import { PrayerTime } from '../../models/PrayerTime';
import Table from '../../components/Table/Table';
import BookmarkInstruction from '../../components/BookmarkInstruction/BookmarkInstruction';

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

  componentDidMount() {

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

  componentDidUpdate(prevProps: Props, prevState: State) {
    
    if (this.props?.tenant && prevProps?.tenant) {
      if (prevProps.tenant.id !== this.props.tenant.id) {

        this.setState({
          isLoading: true,
          salah: undefined
        }, () => {
          this.componentDidMount();
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
      <div data-testid="Home" id="home">
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
