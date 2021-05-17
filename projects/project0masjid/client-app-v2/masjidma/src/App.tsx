import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import configuration from './config/config.prod.json';
import { getQueryString } from './util/util';

interface Props { }
interface TenantConfiguration {
  name: string,
  id: number,
  displayRamadanTimes: boolean,
  ramadanStart: string,
  ramadanEnd: string,
  ramadanTimetable: string,
  announcements: {
    message: string,
    from: string,
    to: string
  }[]
}
interface Configuration {
  tenants: TenantConfiguration[]
}
interface State {
  date: Date,
  configuration: Configuration,
  tenant?: TenantConfiguration
}

class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    
    this.state = {
      date: new Date(),
      configuration: configuration,
    }

    //console.log(configuration);
  }

  getSelectedTenant(): TenantConfiguration {
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
  }

  render() {
    return (
      <div className="App">
        <span>{JSON.stringify(this.state.configuration)}</span>
        <div>date: {this.state.date.toString()}</div>
        <div>tenant: {JSON.stringify(this.state.tenant)}</div>
      </div>
    );
  }
}

export default App;
