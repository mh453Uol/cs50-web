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

        {/* Enable parent component to project content */}
        {this.props.children}

        <Navbar collapseOnSelect bg="dark" variant="dark" fixed="bottom" expand={false}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/" className="nav-link" eventKey="1" key={1}>Home</Nav.Link>
              
              {this.props?.selectedTenant?.ramadanTimetable &&
                <Nav.Link as={Link} to="/ramadan" className="nav-link" eventKey="2" key={2}>Ramadan {new Date().getFullYear()}</Nav.Link>
              }

              <Nav.Link as={Link} to="/about" className="nav-link" eventKey="3" key={3}>About</Nav.Link>
              <Nav.Link as={Link} to="/contact-us" className="nav-link" eventKey="4" key={4}>Contact Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Brand className="ellipsis establishment-name">{this.props.selectedTenant?.name}</Navbar.Brand>
          <DropdownButton menuAlign="right" className="establishment-dropdown" drop="up" title="🕌">
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
      </div>
    );
  }

}

export default Navigation;
