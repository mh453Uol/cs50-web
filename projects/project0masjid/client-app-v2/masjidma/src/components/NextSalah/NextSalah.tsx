import React from 'react';
import { JamaatTime } from '../../models/JamaatTime';
import { PrayerTime } from '../../models/PrayerTime';

import './NextSalah.css';

interface Props {
  salah?: {
    jamaat: JamaatTime,
    start: PrayerTime
  }
}

function timeAgo(date: Date) {
  const value = { days: 0, hours: 0, minutes: 0 };
  const now = new Date();

  // Milliseconds to Seconds 1 mili = 0.001 hence dividing by 1000
  let seconds = Math.abs((date.getTime() - now.getTime()) / 1000);

  // whole days
  const days = Math.floor(seconds / (60 * 60 * 24));
  seconds -= days * (60 * 60 * 24);

  // whole hours e.g 1
  const hours = Math.floor(seconds / (60 * 60)) % 24;
  seconds -= hours * (60 * 60);

  // whole minutes
  const minutes = Math.round(seconds / 60) % 60;
  seconds -= minutes * 60;

  value.days = days;
  value.hours = hours;
  value.minutes = minutes;

  return value;
}

function NextSalah(props: Props) {
  const nextSalah = props.salah?.jamaat.getNextSalah();
  const time = nextSalah?.time?.toLocaleString("en-GB", { hour: 'numeric', minute: 'numeric', hourCycle: "h12" });
  const duration = timeAgo(nextSalah?.time || new Date());

  const days = duration.days ? `${duration.days}d` : "";
  const hours = duration.hours ? `${duration.hours}h` : "";
  const minutes = `${duration.minutes}m`;
  const label = `${days} ${hours} ${minutes}`

  return (
    <div data-testid="NextSalah" className="container">
      <div id="js-next-prayer">{nextSalah?.name} {time}</div>
      <span className="badge badge-pill badge-warning" id="js-next-prayer-from-now">{label}</span>
    </div>
  )
}

export default NextSalah;
