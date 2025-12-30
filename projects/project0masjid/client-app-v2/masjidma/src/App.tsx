import { useState } from 'react';

import Navigation from './components/Navigation/Navigation';

import configuration from './config/config.prod-v2.json';
import { Tenant } from './models/Tenant';
import { getQueryString } from './util/util';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Ramadan from './components/Ramadan/Ramadan';
import About from './components/About/About';
import ContactUs from './components/ContactUs/ContactUs';
import AudioStream from './components/AudioStream/AudioStream';
import { MasjidTenant } from './models/MasjidTenant';

const getSelectedTenant = (): Tenant => {
  const tenantId = window.localStorage.getItem("tenant");

  const defaultTenant = new MasjidTenant(configuration.tenants[0]);

  if (tenantId === null) {
    return defaultTenant;
  }

  const tenant = configuration.tenants.find(t => t.id === Number(tenantId));

  if (!tenant) {
    return defaultTenant;
  }

  return new MasjidTenant(tenant);
}

const initalizeTenant = () => {
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


const tenantSelected = (tenantId: number) => {
  const tenant = configuration.tenants.find(t => t.id === tenantId);
  const defaultTenant = 4;

  if (!tenant) {
    tenantId = defaultTenant;
  }

  window.localStorage.setItem('tenant', tenantId.toString());
}

const App = () => {
    const [tenant, setTenant] = useState(() => {
      initalizeTenant();
      return getSelectedTenant();
    });

    const tenants = configuration.tenants.map((tenant) => new MasjidTenant(tenant));

    const onTenantSelected = (tenantId: number) => {
      tenantSelected(tenantId);
      const tenant = getSelectedTenant();
      setTenant(tenant);
   };

    return (
      <div data-testid="App">
        <Navigation
          tenants={tenants}
          tenant={tenant}
          onTenantSelected={onTenantSelected}>
          <main>
            <Switch>
              <Route path="/ramadan" render={() => <Ramadan tenant={tenant}></Ramadan>}></Route>

              <Route path="/about" render={() => <About></About>}></Route>

              <Route path="/contact-us" render={() => <ContactUs></ContactUs>}></Route>

              <Route path="/radio" render={() =><AudioStream tenant={tenant}></AudioStream>}></Route>

              <Route path="*" render={() => <Home tenant={tenant}></Home>} exact></Route>
            </Switch>
          </main>
        </Navigation>
      </div>
    );
}

export default App;
