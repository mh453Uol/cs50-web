import React from 'react';
import { JamaatTime } from '../../models/JamaatTime';
import { PrayerTime } from '../../models/PrayerTime';
import './Table.css';
import classNames from 'classnames';
export interface Props {
  salah?: {
    jamaat: JamaatTime,
    start: PrayerTime
  }
}

export interface State {
}

class Table extends React.Component<Props, State> {

  formatAsHoursMinutes(date?: Date): string {

    if (date === undefined) {
      return '-';
    }

    return date.toLocaleString("en-GB", {
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: "h12"
    })
  }

  render() {
    const nextSalah = this.props?.salah?.jamaat.getNextSalah().name || '';
    return (
      <div className="table-responsive table-bordered">
        <table className="table" id="js-prayer-time-table">
          <thead>
            <tr>
              <th scope="col">Salah<span className="float-right">نماز</span></th>
              <th scope="col" style={{ width: "31%" }}>Start <span className="float-right">شروع کریں</span></th>
              <th scope="col" style={{ width: "31%" }}>Jamaat <span className="float-right">جمات</span></th>
            </tr>
          </thead>
          <tbody>
            <tr className={classNames({ "table-active": nextSalah === "Fajr"})}>
              <th scope="row">Fajr <span className="float-right">فجر</span></th>
              <td id="js-fajr-start" className="text-center">{this.formatAsHoursMinutes(this.props.salah?.start.fajr)}</td>
              <td id="js-fajr-jamaat" className="text-center">{this.formatAsHoursMinutes(this.props.salah?.jamaat.fajr)}</td>
            </tr>
            <tr>
              <th scope="row">Sunrise</th>
              <td colSpan={2} className="text-center" id="js-sunrise-start">{this.formatAsHoursMinutes(this.props.salah?.start.sunrise)}</td>
            </tr>
            <tr>
              <th scope="row">Dahawa Kubra</th>
              <td id="js-dahawa-kubra-start" colSpan={2} className="text-center">{this.formatAsHoursMinutes(this.props.salah?.start.dahwakubra)}</td>
            </tr>
            <tr className={classNames({ "table-active": nextSalah === "Dhuhr"})}>
              <th scope="row">Dhuhr <span className="float-right">ظہر</span></th>
              <td id="js-dhuhr-start" className="text-center">{this.formatAsHoursMinutes(this.props.salah?.start.dhuhr)}</td>
              <td id="js-dhuhr-jamaat" className="text-center">{this.formatAsHoursMinutes(this.props.salah?.jamaat.dhuhr)}</td>
            </tr>
            <tr className={classNames({ "table-active": nextSalah === "Asr"})}>
              <th scope="row">Asr <span className="float-right">اثر</span></th>
              <td id="js-asr-start" className="text-center">{this.formatAsHoursMinutes(this.props.salah?.start.asr)}</td>
              <td id="js-asr-jamaat" className="text-center">{this.formatAsHoursMinutes(this.props?.salah?.jamaat.asr)}</td>
            </tr>
            <tr className={classNames({ "table-active": nextSalah === "Maghrib"})}>
              <th scope="row">Maghrib <span className="float-right">مغرب</span></th>
              <td colSpan={2} id="js-magrib-start" className="text-center">{this.formatAsHoursMinutes(this.props.salah?.start.maghrib)}</td>
            </tr>
            <tr className={classNames({ "table-active": nextSalah === "Isha"})}>
              <th scope="row">Isha <span className="float-right">عشاء</span></th>
              <td id="js-isha-start" className="text-center">{this.formatAsHoursMinutes(this.props.salah?.start.isha)}</td>
              <td id="js-isha-jamaat" className="text-center">{this.formatAsHoursMinutes(this.props.salah?.jamaat.isha)}</td>
            </tr>
            <tr className={classNames({ "table-active": nextSalah === "1st Jummah"})}>
              <th scope="row">Jummah 1 <span className="float-right">جمعہ</span></th>
              <td colSpan={2} className="text-center" id="js-jummah1-jamaat">{this.formatAsHoursMinutes(this.props.salah?.jamaat.jummah1)}</td>
            </tr>
            <tr className={classNames({ "table-active": nextSalah === "2nd Jummah"})}>
              <th scope="row">Jummah 2 <span className="float-right">جمعہ</span></th>
              <td colSpan={2} className="text-center" id="js-jummah2-jamaat">{this.formatAsHoursMinutes(this.props.salah?.jamaat.jummah2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
export default Table;
