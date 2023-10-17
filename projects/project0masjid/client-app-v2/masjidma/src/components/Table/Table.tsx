import React from 'react';
import { JamaatTime } from '../../models/JamaatTime';
import { PrayerTime } from '../../models/PrayerTime';
import './Table.css';
import classNames from 'classnames';
import { formatAsHoursMinutes } from '../../util/util';

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
      <div className="table-responsive table-bordered">
        <table className="table" id="js-prayer-time-table">
          <thead>
            <tr>
              <th scope="col">Salah<span className="float-right">نماز</span></th>
              <th scope="col" style={{ width: "31%" }}>Start <span className="float-right">شروع کریں</span></th>
              <th scope="col" style={{ width: "31%" }}>Iqamah <span className="float-right">جمات</span></th>
            </tr>
          </thead>
          <tbody>
            <tr className={classNames({ "table-active": nextSalah === "Fajr" })}>
              <th scope="row">Fajr <span className="float-right">فجر</span></th>
              <td id="js-fajr-start" className="text-center">{formatAsHoursMinutes(props.salah?.start.fajr)}</td>
              <td id="js-fajr-jamaat" className="text-center">{formatAsHoursMinutes(props.salah?.jamaat.fajr)}</td>
            </tr>
            <tr>
              <th scope="row">Sunrise</th>
              <td colSpan={2} className="text-center" id="js-sunrise-start">{formatAsHoursMinutes(props.salah?.start.sunrise)}</td>
            </tr>
            <tr className={classNames({ "table-active": nextSalah === "Dhuhr" })}>
              <th scope="row">Dhuhr <span className="float-right">ظہر</span></th>
              <td id="js-dhuhr-start" className="text-center">{formatAsHoursMinutes(props.salah?.start.dhuhr)}</td>
              <td id="js-dhuhr-jamaat" className="text-center">{formatAsHoursMinutes(props.salah?.jamaat.dhuhr)}</td>
            </tr>
            <tr className={classNames({ "table-active": nextSalah === "Asr" })}>
              <th scope="row">Asr <span className="float-right">عصر</span></th>
              <td id="js-asr-start" className="text-center">{formatAsHoursMinutes(props.salah?.start.asr)}</td>
              <td id="js-asr-jamaat" className="text-center">{formatAsHoursMinutes(props?.salah?.jamaat.asr)}</td>
            </tr>
            <tr className={classNames({ "table-active": nextSalah === "Maghrib" })}>
              <th scope="row">Maghrib <span className="float-right">مغرب</span></th>
              <td colSpan={2} id="js-magrib-start" className="text-center">{formatAsHoursMinutes(props.salah?.start.maghrib)}</td>
            </tr>
            <tr className={classNames({ "table-active": nextSalah === "Isha" })}>
              <th scope="row">Isha <span className="float-right">عشاء</span></th>
              <td id="js-isha-start" className="text-center">{formatAsHoursMinutes(props.salah?.start.isha)}</td>
              <td id="js-isha-jamaat" className="text-center">{formatAsHoursMinutes(props.salah?.jamaat.isha)}</td>
            </tr>
            <tr className={classNames({ "table-active": nextSalah === "1st Jummah" })}>
              <th scope="row">Jummah 1 <span className="float-right">جمعہ</span></th>
              <td colSpan={2} className="text-center" id="js-jummah1-jamaat">{formatAsHoursMinutes(props.salah?.jamaat.jummah1)}</td>
            </tr>
            <tr className={classNames({ "table-active": nextSalah === "2nd Jummah" })}>
              <th scope="row">Jummah 2 <span className="float-right">جمعہ</span></th>
              <td colSpan={2} className="text-center" id="js-jummah2-jamaat">{formatAsHoursMinutes(props.salah?.jamaat.jummah2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Table;
