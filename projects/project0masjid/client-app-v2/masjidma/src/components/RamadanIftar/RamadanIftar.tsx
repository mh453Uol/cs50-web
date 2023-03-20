import React from 'react';
import { Tenant } from '../../models/Tenant';

import { dateDiffInDays, ordinalSuffixOf, formatAsHoursMinutes } from '../../util/util';

interface Props {
  tenant: Tenant,
  date: Date,
  suhoor?: Date,
  iftar?: Date,
}

const RamadanIftar: React.FC<Props> = (props: Props) => {  
  let date = props.date;

  // compute if its the 1st, 2nd, 3rd day of ramadan
  let ordinalRamadanDay = dateDiffInDays(props.tenant.ramadanStart, props.date) + 1;
  let ordinal = ordinalSuffixOf(ordinalRamadanDay);

  // Set first day of ramadan if we are not in ramadan season
  if (date <= props.tenant.ramadanStart) {
    date = props.tenant.ramadanStart;
    ordinal = '1st';
  }


  const dateLabel = date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const ramadanDateLabel = `${ordinal} Ramadan (${dateLabel})`


  return (
    <div data-testid="RamadanIftar">
      <div className="m-1">
        <div className="text-center mb-1 lead">{ramadanDateLabel}</div>

        <div className="row">
          <div className="suhoor col">
            <div className="card">
              <div className="card-body p-1">
                <div className="text-center bold"><b>Sehri</b></div>
                <div className="text-center">
                  <span className="js-suhoor-end">{formatAsHoursMinutes(props.suhoor)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="iftar col">
            <div className="card">
              <div className="card-body p-1">
                <div className="text-center"><b>Iftar</b></div>
                <div className="text-center ">
                  <span className="js-iftar-start">{formatAsHoursMinutes(props.iftar)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a href={props.tenant.ramadanTimetable} className="btn btn-primary btn-block mt-2" role="button">Ramadan Timetable <span className="urdu-text">رمضان ٹائم ٹیبل</span></a>
      </div>
    </div>
  )
};

export default RamadanIftar;
