import React from 'react';

import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';

import configuration from './config/config.prod.json';
import { Tenant } from './models/Tenant';
import { getQueryString } from './util/util';
import { getJamaatTimes, getPrayerStartTimes } from './services/prayertime/Prayertime.service';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { JamaatTime } from './models/JamaatTime';
import { PrayerTime } from './models/PrayerTime';
import Table from './components/Table/Table';

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
    
    this.setState({
      tenant: this.state.tenant,
      configuration: this.state.configuration,
      date: this.state.date,
      isLoading: true //set isLoading to true
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
      configuration: this.state.configuration,
      date: this.state.date
    })

    this.getSalahTime()
      .then(([jamaat, startTime]) => {
        
        this.setState({
          tenant: tenant,
          configuration: this.state.configuration,
          date: this.state.date,
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
      configuration: this.state.configuration,
      date: this.state.date
    })
  }

  render() {
    return (
      <Navigation
        tenants={this.state.configuration.tenants}
        selectedTenant={this.state.tenant}
        tenantSelected={this.tenantSelected}>
        <Header
          date={this.state.date}
          isLoading={this.state.isLoading}
          salah={this.state.salah}>
        </Header>
        {/* <div className="App">
          <div>{JSON.stringify(this.state.salah)}</div>
          <div>date: {this.state.date.toString()}</div>
          <div>tenant: {JSON.stringify(this.state.tenant)}</div>
        </div> */}

      <div id="App">
        <Table
          salah={this.state.salah}>
        </Table>

        <div className="m-2">
            <p className="text-center">
                <b>Follow these instructions to add this page to your phones home screen</b>
            </p>

            <div className="text-center">
                <b>iPhone</b>
            </div>

            <ol>
                <li>Tap the Share icon</li>
                <li>Tap add to Home Screen</li>
                <li>Enter name for bookmark</li>
            </ol>
            
            <div className="text-center">
                <b>Android</b>
            </div>

            <ol>
                <li>Tap the menu icon (3 dots in upper right-hand corner)</li>
                <li>Tap add to homescreen</li>
                <li>Enter name for bookmark</li>
            </ol>
        </div>
      </div>
      </Navigation>
    );
  }
}

export default App;
