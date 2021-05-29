import React from 'react';
import { Tenant } from '../../models/Tenant';

interface Props {
  tenant: Tenant
}

const Ramadan: React.FC<Props> = (props: Props) => (
  <div data-testid="Ramadan">
    <div className="container mt-2">
      <h1>Ramadan</h1>
      <p>Ramadan is one of the most special and loved months in the Islamic calendar - a time for reflection, prayer, and reward.</p>


      <p className="lead" style={{ fontWeight: "bold" }}>Ramadan Timetable</p>
      <div id="ramadan-timetable-container">

        <a href={props.tenant?.ramadanTimetable} target="_blank">
          <img src={props.tenant?.ramadanTimetable} id="ramadan-timetable" className="img-fluid"></img>
        </a>
      </div>
    </div>
  </div>
);

export default Ramadan;
