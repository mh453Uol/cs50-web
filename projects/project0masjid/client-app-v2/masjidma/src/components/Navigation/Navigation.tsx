import React, { ReactNode } from 'react';
import { Tenant } from '../../models/Tenant';

import './Navigation.css';

import { Dropdown, DropdownButton, Nav, Navbar } from 'react-bootstrap';

interface Props {
  children: ReactNode,
  tenants: Tenant[],
  selectedTenant?: Tenant,
  tenantSelected: (tenant: Tenant) => void
}

class Navigation extends React.Component<Props, any> {

  constructor(props: Props) {
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

        <Navbar bg="dark" expand="xl" variant="dark" fixed="bottom">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto"> 
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#ramadan">Ramadan 2021</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#contactus">Contact Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Brand className="ellipsis establishment-name">{this.props.selectedTenant?.name}</Navbar.Brand>
          <DropdownButton menuAlign="right" className="establishment-dropdown" drop="up" title="🕌">
            {this.props?.tenants?.map(tenant =>
              <Dropdown.Item
                data-tenant={tenant.id}
                className="dropdown-item"
                onClick={this.setTenant}>{tenant.name}
              </Dropdown.Item>
            )}
          </DropdownButton>
        </Navbar>
      </div>
    );
  }

}

export default Navigation;
