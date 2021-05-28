import React from 'react';

import Navigation from './components/Navigation/Navigation';

import configuration from './config/config.prod.json';
import { Tenant } from './models/Tenant';
import { getQueryString } from './util/util';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Ramadan from './components/Ramadan/Ramadan';
import About from './components/About/About';
import ContactUs from './components/ContactUs/ContactUs';

interface Props { }
interface Configuration {
  tenants: Tenant[]
}
interface State {
  configuration: Configuration,
  tenant: Tenant
}

class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.tenantSelected = this.tenantSelected.bind(this);
  }

  getSelectedTenant(): Tenant {
    const tenantId = window.localStorage.getItem("tenant");
    const defaulTenant = configuration.tenants[0];

    if (tenantId === null) {
      return defaulTenant;
    }

    const tenant = configuration.tenants.find(t => t.id === Number(tenantId));

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
        tenantId = configuration.tenants[0].id.toString();
      }
    }

    window.localStorage.setItem('tenant', tenantId);
  }

  componentDidMount() {
    this.initalizeTenant();

    const tenant = this.getSelectedTenant();

    this.setState({
      configuration: configuration,
      tenant: tenant,
    })
  }

  tenantSelected(newTenant: Tenant): void {

    window.localStorage.setItem('tenant', newTenant.id.toString());

    this.setState({
      tenant: newTenant
    })
  }

  render() {
    return (
      <div data-testid="App">
        <Navigation
          tenants={this.state?.configuration.tenants}
          selectedTenant={this.state?.tenant}
          tenantSelected={this.tenantSelected}>

          <main>
            <Switch>
              <Route path="/" render={(props) =>
                <Home
                  {...props}
                  tenant={this.state?.tenant}>
                </Home>} exact>
              </Route>

              <Route path="/ramadan" render={(props) => <Ramadan></Ramadan>}></Route>

              <Route path="/about" render={(props) => <About></About>}></Route>

              <Route path="/contact-us" render={(props) => <ContactUs></ContactUs>}></Route>
            </Switch>
          </main>
        </Navigation>
      </div>
    );
  }
}

export default App;
