import React, { ReactNode } from 'react';
import { Tenant } from '../../models/Tenant';

import './Navigation.css';

import { Dropdown, DropdownButton, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

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
        <Navbar collapseOnSelect bg="light" variant="light" expand={false}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/" className="nav-link" eventKey="1" key={1}>Home</Nav.Link>
              <Nav.Link as={Link} to={`/radio/${this.props?.selectedTenant?.id}?utm_source=southcourtmosquedotlive&utm_medium=navbar-home-page`} className="nav-link" eventKey="2" key={2}>Radio</Nav.Link>
              
              {this.props?.selectedTenant?.ramadanTimetable &&
                <Nav.Link as={Link} to="/ramadan" className="nav-link" eventKey="3" key={3}>Ramadan {new Date().getFullYear()}</Nav.Link>
              }

              <Nav.Link as={Link} to="/about" className="nav-link" eventKey="4" key={4}>About</Nav.Link>
              <Nav.Link as={Link} to="/contact-us" className="nav-link" eventKey="5" key={5}>Contact Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>

          <DropdownButton menuAlign="right" className="establishment-dropdown" drop="down" title={this.props.selectedTenant?.name || 'Loading'}>
            {this.props?.tenants?.map(tenant =>
              <Dropdown.Item
                className={classNames({ "active": tenant.id === this.props?.selectedTenant?.id})}
                data-tenant={tenant.id}
                onClick={this.setTenant}
                key={tenant.name}>{tenant.name}
              </Dropdown.Item>
            )}
          </DropdownButton>
        </Navbar>

        {/* Enable parent component to project content */}
        {this.props.children}
        
      </div>
    );
  }

}

export default Navigation;
