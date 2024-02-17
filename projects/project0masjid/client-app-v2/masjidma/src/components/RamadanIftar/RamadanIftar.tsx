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
  const ramadanDateLabel = `${ordinal} Ramadan (${dateLabel})`

  return (
    <div data-testid="RamadanIftar">
      <div className="m-1">
        <div className="text-center mb-1 lead">{ramadanDateLabel}</div>
        <div className="container-fluid">
          <div className="row d-flex">
            <div className="suhoor col pl-0">
              <div className="card">
                <div className="card-body p-1">
                  <div className="text-center bold"><b>Sehri</b></div>
                  <div className="text-center">
                    <span className="js-suhoor-end">{formatAsHoursMinutes(suhoor)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="iftar col pr-0">
              <div className="card">
                <div className="card-body p-1">
                  <div className="text-center"><b>Iftar</b></div>
                  <div className="text-center ">
                    <span className="js-iftar-start">{formatAsHoursMinutes(iftar)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a href="/ramadan" className="btn btn-secondary btn-block mt-2" role="button">Ramadan Timetable <span className="urdu-text">رمضان ٹائم ٹیبل</span></a>
      </div>
    </div>
  );
};
export default RamadanIftar;
