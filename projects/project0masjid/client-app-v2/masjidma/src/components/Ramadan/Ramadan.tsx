import { Tenant } from '../../models/Tenant';

const Ramadan = ({ tenant }: { tenant: Tenant }) => {
  return (
    <div data-testid="Ramadan">
      <div className="container mt-2">
        <h1>Ramadan</h1>
        <p>Ramadan is one of the most special and loved months in the Islamic calendar - a time for reflection, prayer, and reward.</p>

        <p className="lead" style={{ fontWeight: "bold" }}>Ramadan Timetable</p>
        <div id="ramadan-timetable-container">

          <a href={tenant?.ramadanTimetable} target="_blank" rel="noreferrer">
            <img src={tenant?.ramadanTimetable} id="ramadan-timetable" className="img-fluid" alt={tenant?.name}></img>
          </a>
        </div>
      </div>
    </div>
  )
};

export default Ramadan;
