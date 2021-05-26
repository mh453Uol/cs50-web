import React from 'react';

import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';

import configuration from './config/config.prod.json';
import { Tenant } from './models/Tenant';
import { addDays, getQueryString } from './util/util';
import { getJamaatTimes, getPrayerStartTimes } from './services/prayertime/Prayertime.service';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { JamaatTime } from './models/JamaatTime';
import { PrayerTime } from './models/PrayerTime';
import Table from './components/Table/Table';
import BookmarkInstruction from './components/BookmarkInstruction/BookmarkInstruction';

interface Props { }
interface Configuration {
  tenants: Tenant[]
}
interface State {
  date: Date,
  configuration: Configuration,
  tenant?: Tenant,
  isLoading: boolean,
  salah?: {
    jamaat: JamaatTime,
    start: PrayerTime
  }
}

class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: true,
      date: new Date(),
      configuration: configuration,
    }

    this.tenantSelected = this.tenantSelected.bind(this);
    this.onYesterdayClick = this.onYesterdayClick.bind(this);
    this.onTomorrowClick = this.onTomorrowClick.bind(this);
  }

  getSelectedTenant(): Tenant {
    const tenantId = window.localStorage.getItem("tenant");
    const defaulTenant = this.state.configuration.tenants[0];

    if (tenantId === null) {
      return defaulTenant;
    }

    const tenant = this.state.configuration.tenants.find(t => t.id === Number(tenantId));

    if (!tenant) {
      return defaulTenant;
    }

    return tenant;
  }

  initalizeTenant(): void {
    // look at the url since we should have a tenant parameter e.g. xyz.com?tenant=1
    let tenantId = getQueryString('tenant', window.location.href);

    // if tenant not specified look at localStorage else default back
    if (!tenantId) {
      const tenant = window.localStorage.getItem('tenant');

      if (tenant) {
        tenantId = tenant;
      } else {
        tenantId = this.state.configuration.tenants[0].id.toString();
      }
    }

    window.localStorage.setItem('tenant', tenantId);
  }

  getSalahTime(): Promise<[JamaatTime, PrayerTime]> {
    console.log(this.state);

    this.setState({
      isLoading: true
    });

    return Promise.all([
      getJamaatTimes(this.state.date),
      getPrayerStartTimes(this.state.date),
    ]);
  }

  componentDidMount() {
    this.initalizeTenant();

    const tenant = this.getSelectedTenant();

    this.setState({
      tenant: tenant,
    })

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

  tenantSelected(newTenant: Tenant): void {
    this.setState({
      tenant: newTenant,
    })
  }

  onYesterdayClick() {
    const yesterday = addDays(-1, this.state.date);
    console.log(yesterday);

    this.setState({
      date: yesterday,
      salah: undefined
    }, () => {
      this.componentDidMount();
    });
  }

  onTomorrowClick() {
    const tomorrow = addDays(1, this.state.date);
    console.log(tomorrow);
    this.setState({
      date: tomorrow,
      salah: undefined
    }, () => {
      this.componentDidMount();
    });
  }

  render() {
    return (
      <Navigation
        tenants={this.state.configuration.tenants}
        selectedTenant={this.state.tenant}
        tenantSelected={this.tenantSelected}>
        <div id="App">
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
      </Navigation>
    );
  }
}

export default App;
