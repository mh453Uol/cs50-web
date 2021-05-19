import React, { ReactNode, SyntheticEvent } from 'react';
import { Tenant } from '../../models/Tenant';

import { Dropdown, DropdownButton } from 'react-bootstrap';

interface Props {
  children: ReactNode,
  tenants: Tenant[],
  selectedTenant?: Tenant,
  tenantSelected: (tenant: Tenant) => void
}

class Navigation extends React.Component<Props, any> {

  constructor(props:Props) {
    super(props)
    this.setTenant = this.setTenant.bind(this);
  }

  setTenant(e: any) {
    const tenantId = e?.target?.dataset?.tenant;

    if (tenantId) {
      const parsedId = parseInt(tenantId);
      const tenant = this.props.tenants.find(t => t.id === parsedId);

      if (tenant) {
        this.props.tenantSelected(tenant);
      }
    }
  }
  
  render() {
    return (
      <div data-testid="Navigation">

        {/* Enable parent component to project content */}
        {this.props.children}

        <nav className="navbar fixed-bottom navbar-dark bg-dark">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="./index.html">Home <span className="sr-only">(current)</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="./ramadan.html">Ramadan 2021</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="./about.html">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="./contact-us.html">Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="navbar-brand ellipsis establishment-name">{this.props.selectedTenant?.name}</div>

          <DropdownButton id="dropdown-basic-button" title="🕌">
            {this.props.tenants.map(tenant =>
              <Dropdown.Item
                data-tenant={tenant.id}
                className="dropdown-item"
                onClick={this.setTenant}>{tenant.name}</Dropdown.Item>
            )}
          </DropdownButton>

          {/* <div className="btn-group dropup">
          <button className="btn btn-primary btn-sm dropdown-toggle establishment-dropdown" type="button"
            id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span>🕌</span>
          </button>
          <div className="dropdown-menu dropdown-menu-right" id="setting-dropdown" aria-labelledby="dropdownMenuButton">
            <div id="tenant-dropdown">
              {props.tenants.map(tenant => <div className="dropdown-item">{tenant.name}</div>)}
            </div>
          </div>
        </div> */}
        </nav>
      </div>
    );
  }

}

export default Navigation;
