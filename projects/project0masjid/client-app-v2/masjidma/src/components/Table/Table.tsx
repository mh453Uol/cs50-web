import React from 'react';
import { JamaatTime } from '../../models/JamaatTime';
import { PrayerTime } from '../../models/PrayerTime';
import './Table.css';
import classNames from 'classnames';
import { formatAsHoursMinutes } from '../../util/util';
import BootstrapTable from 'react-bootstrap/Table';

export interface Props {
  salah?: {
    jamaat: JamaatTime,
    start: PrayerTime
  }
}

const Table = (props: Props) => {
  const nextSalah = props?.salah?.jamaat.getNextSalah().name || '';

  return (
    <div data-testid="Table">
      <BootstrapTable responsive={true} id="js-prayer-time-table">
        <thead>
          <tr>
            <th scope="col">Salah <span className="pl-1">نماز</span></th>
            <th scope="col">Start <span className="pl-1">شروع کریں</span></th>
            <th scope="col">Iqamah <span className="pl-1">جمات</span></th>
          </tr>
        </thead>
        <tbody>
          <tr className={classNames({ "table-active": nextSalah === "Fajr" })}>
            <th scope="row">Fajr <span className="pl-1">فجر</span></th>
            <td id="js-fajr-start">{formatAsHoursMinutes(props.salah?.start.fajr)}</td>
            <td id="js-fajr-jamaat">{formatAsHoursMinutes(props.salah?.jamaat.fajr)}</td>
          </tr>
          <tr>
            <th scope="row">Sunrise</th>
            <td colSpan={1} id="js-sunrise-start">{formatAsHoursMinutes(props.salah?.start.sunrise)}</td>
            <td colSpan={2} id="js-sunrise-start">{formatAsHoursMinutes(props.salah?.start.sunrise)}</td>
          </tr>
          <tr className={classNames({ "table-active": nextSalah === "Dhuhr" })}>
            <th scope="row">Dhuhr <span className="pl-1">ظہر</span></th>
            <td id="js-dhuhr-start" >{formatAsHoursMinutes(props.salah?.start.dhuhr)}</td>
            <td id="js-dhuhr-jamaat" >{formatAsHoursMinutes(props.salah?.jamaat.dhuhr)}</td>
          </tr>
          <tr className={classNames({ "table-active": nextSalah === "Asr" })}>
            <th scope="row">Asr <span className="pl-1">عصر</span></th>
            <td id="js-asr-start" >{formatAsHoursMinutes(props.salah?.start.asr)}</td>
            <td id="js-asr-jamaat" >{formatAsHoursMinutes(props?.salah?.jamaat.asr)}</td>
          </tr>
          <tr className={classNames({ "table-active": nextSalah === "Maghrib" })}>
            <th scope="row">Maghrib <span className="pl-1">مغرب</span></th>
            <td colSpan={1} id="js-magrib-start" >{formatAsHoursMinutes(props.salah?.start.maghrib)}</td>
            <td colSpan={2} id="js-magrib-start" >{formatAsHoursMinutes(props.salah?.start.maghrib)}</td>
          </tr>
          <tr className={classNames({ "table-active": nextSalah === "Isha" })}>
            <th scope="row">Isha <span className="pl-1">عشاء</span></th>
            <td id="js-isha-start" >{formatAsHoursMinutes(props.salah?.start.isha)}</td>
            <td id="js-isha-jamaat" >{formatAsHoursMinutes(props.salah?.jamaat.isha)}</td>
          </tr>
          <tr className={classNames({ "table-active": nextSalah === "1st Jummah" })}>
            <th scope="row">Jummah 1 <span className="pl-1">جمعہ</span></th>
            <td colSpan={1}  id="js-jummah1-jamaat">{formatAsHoursMinutes(props.salah?.jamaat.jummah1)}</td>
            <td colSpan={2}  id="js-jummah1-jamaat">{formatAsHoursMinutes(props.salah?.jamaat.jummah1)}</td>
          </tr>
          <tr className={classNames({ "table-active": nextSalah === "2nd Jummah" })}>
            <th scope="row">Jummah 2 <span className="pl-1">جمعہ</span></th>
            <td colSpan={1}  id="js-jummah2-jamaat">{formatAsHoursMinutes(props.salah?.jamaat.jummah2)}</td>
            <td colSpan={2}  id="js-jummah2-jamaat">{formatAsHoursMinutes(props.salah?.jamaat.jummah2)}</td>
          </tr>
        </tbody>
      </BootstrapTable>
    </div>
  );
}
export default Table;
