import React from 'react';

import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';

import configuration from './config/config.prod.json';
import { Tenant } from './models/Tenant';
import { getQueryString } from './util/util';
import { getJamaatTimes, getPrayerStartTimes } from './services/prayertime/Prayertime.service';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Props { }
interface Configuration {
  tenants: Tenant[]
}
interface State {
  date: Date,
  configuration: Configuration,
  tenant?: Tenant,
  isLoading: boolean
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

  componentDidMount() {
    this.initalizeTenant();

    const tenant = this.getSelectedTenant();

    this.setState({
      tenant: tenant,
      configuration: this.state.configuration,
      date: this.state.date
    })

    
  Promise.all([
    getJamaatTimes(this.state.date),
    getPrayerStartTimes(this.state.date),
  ]).then(([jamaat, startTime]) => {
    console.log(jamaat, startTime);
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
            isLoading={this.state.isLoading}>
          </Header>
        <div className="App">
          <div>{JSON.stringify(this.state.configuration)}</div>
          <div>date: {this.state.date.toString()}</div>
          <div>tenant: {JSON.stringify(this.state.tenant)}</div>
        </div>
      </Navigation>
    );
  }
}

export default App;
