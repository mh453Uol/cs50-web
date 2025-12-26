import { ReactNode } from 'react';
import { Tenant } from '../../models/Tenant';

import './Navigation.css';

import { Container, Dropdown, DropdownButton, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

interface Props {
  children: ReactNode,
  tenants: Tenant[],
  tenant?: Tenant,
  onTenantSelected: (tenantId: number) => void
}

const onSetTenant = (e: any, tenantSelectedFn: (tenantId: number) => void) => {
  const tenantId = e?.target?.dataset?.tenant;

  if (tenantId) {
    const parsedId = parseInt(tenantId);
    tenantSelectedFn(parsedId);
  }
};

const Navigation = (props: Props) => {
  return (
    <div data-testid="Navigation">      
      {/* Enable parent component to project content */}
      <div className="app-container">
        {props.children}
      </div>
      <Navbar collapseOnSelect={true} fixed="bottom" expand={false} data-bs-theme="dark" bg='dark'>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto ml-2 text-center">
              <Nav.Link as={Link} to="/" className="nav-link" eventKey="1" key={1}>Home</Nav.Link>
              <Nav.Link as={Link} to={`/radio/${props?.tenant?.id}?utm_source=southcourtmosquedotlive&utm_medium=navbar-home-page`} className="nav-link" eventKey="2" key={2}>Radio</Nav.Link>
              {props?.tenant?.displayRamadanTimes &&
                <Nav.Link as={Link} to="/ramadan" className="nav-link" eventKey="3" key={3}>Ramadan {new Date().getFullYear()}</Nav.Link>
              }
              {props?.tenant?.donationLink &&
                <Nav.Link href={props?.tenant?.donationLink} className="nav-link" eventKey={6} key={6}>Donate</Nav.Link>
              }
              <Nav.Link as={Link} to="/about" className="nav-link" eventKey="4" key={4}>About</Nav.Link>
              <Nav.Link as={Link} to="/contact-us" className="nav-link" eventKey="5" key={5}>Contact Us</Nav.Link>
            </Nav>
            <div className="card my-2 ml-3">
              <div className="card-body d-flex align-items-center justify-content-center">
                <img src="./img/wedesignedit-favicon.png" alt="wedesignedit logo" className="me-3" />
                <div>
                  <p className="mb-0">Developed By <a href="https://wedesignedit.co.uk/" target="_blank" rel="noopener noreferrer">WeDesignedIt</a></p>
                </div>
              </div>
            </div>
          </Navbar.Collapse>

          <DropdownButton className="establishment-dropdown" drop="up" title={props.tenant?.name || 'Loading'}>
            {props?.tenants?.map(tenant =>
              <Dropdown.Item
                className={classNames({ "active": tenant.id === props?.tenant?.id, "ellipsis": true })}
                data-tenant={tenant.id}
                onClick={(e) => onSetTenant(e, props.onTenantSelected)}
                href={`?tenant=${tenant?.id}`}
                key={tenant.name}>{tenant.name}
              </Dropdown.Item>
            )}
          </DropdownButton>
        </Container>
      </Navbar>
    </div>
  );
}

export default Navigation;
