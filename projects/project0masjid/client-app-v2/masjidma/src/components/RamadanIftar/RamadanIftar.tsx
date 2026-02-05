import { Tenant } from '../../models/Tenant';

import { dateDiffInDays, ordinalSuffixOf, formatAsHoursMinutes } from '../../util/util';

interface Props {
  tenant: Tenant,
  date: Date,
  suhoor?: Date,
  iftar?: Date,
}

const RamadanIftar = ({ tenant, date, suhoor, iftar }: Props) => {

  // compute if its the 1st, 2nd, 3rd day of ramadan
  let ordinalRamadanDay = dateDiffInDays(tenant.ramadanStart, date) + 1;
  let ordinal = ordinalSuffixOf(ordinalRamadanDay);

  // Set first day of ramadan if we are not in ramadan season
  if (date <= tenant.ramadanStart) {
    date = tenant.ramadanStart;
    ordinal = '1st';
  }

  const dateLabel = date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const ramadanDateLabel = `${ordinal} Ramadan (${dateLabel})`;

  function handleClick() {
    window.open(tenant.ramadanTimetable);
  }


  return (
    <div data-testid="RamadanIftar">
      <div className="m-3">
        <h5 className="text-center mb-1">{ramadanDateLabel}</h5>
        <div className="container">
          <div className='row'>
          <div className="card col" style={{marginRight: '5px'}}>
            <div className="card-body p-1">
              <div className="text-center"><b>Sehri</b></div>
              <div className="text-center">
                <span className="js-suhoor-end">{date <= tenant.ramadanStart ? tenant?.sehri : formatAsHoursMinutes(suhoor)}</span>
              </div>
            </div>
          </div>
          <div className="card col">
            <div className="card-body p-1">
              <div className="text-center"><b>Iftar</b></div>
              <div className="text-center ">
                <span className="js-iftar-start">{date <= tenant.ramadanStart ? tenant?.iftar : formatAsHoursMinutes(iftar)}</span>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div className='d-flex flex-column'>
          <a href={tenant.ramadanTimetable} className="mt-2 btn btn-secondary btn-block" role="button" onClick={handleClick}>Ramadan Timetable <span className="urdu-text">رمضان ٹائم ٹیبل</span></a>
        </div>
      </div>
    </div>
  );
};
export default RamadanIftar;
