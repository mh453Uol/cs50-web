import React from 'react';
import { Alert, Navbar } from 'react-bootstrap';
import { Announcement } from '../../models/Annoucement';
import { Tenant } from '../../models/Tenant';
import { inRange } from '../../util/util';
import './Announcement.css';

interface Props {
  tenant: Tenant,
  date: Date
}

const Announcements: React.FC<Props> = (props: Props) => {

  let announcements: Announcement[] = [];
  
  if (props.tenant?.announcements) {

    announcements = props.tenant.announcements.filter((announcement) => 
      inRange(props.date, new Date(announcement.from), new Date(announcement.to))
    );
  
  }

  return (
    <div data-testid="Announcement">
      { announcements.length > 0 &&
          <Alert key={1} variant="success" className="text-center">
            {announcements.map((announcement: Announcement) => <div key={announcement.message}>{announcement.message}</div>)}
          </Alert>
      }
    </div>
  )
};

export default Announcements;
