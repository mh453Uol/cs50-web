import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import configuration from './config/config.prod.json';
import { getQueryString } from './util/util';
import Navigation from './components/Navigation/Navigation';
import { Tenant } from './models/Tenant';

interface Props { }
interface Configuration {
  tenants: Tenant[]
}
interface State {
  date: Date,
  configuration: Configuration,
  tenant?: Tenant
}

class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    
    this.state = {
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
        <div className="App">
          <span>{JSON.stringify(this.state.configuration)}</span>
          <div>date: {this.state.date.toString()}</div>
          <div>tenant: {JSON.stringify(this.state.tenant)}</div>
        </div>
      </Navigation>
    );
  }
}

export default App;
