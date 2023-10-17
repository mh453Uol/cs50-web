import React from "react";
import { JamaatTime } from '../../models/JamaatTime';
import { PrayerTime } from '../../models/PrayerTime';
import { timeAgo } from "../../util/util";
import { formatAsHoursMinutes } from '../../util/util';

import './NextSalah.css';

interface Props {
  salah?: {
    jamaat: JamaatTime,
    start: PrayerTime
  }
}

function getDurationTillNextSalah(nextSalah: Date) {
  const duration = timeAgo(nextSalah);

  const days = duration.days ? `${duration.days}d` : "";
  const hours = duration.hours ? `${duration.hours}h` : "";
  const minutes = `${duration.minutes}m`;
  return `${days} ${hours} ${minutes}`
}

const NextSalah = (props: Props) => {
  const salah = props?.salah?.jamaat.getNextSalah();
  const label = getDurationTillNextSalah(salah?.time || new Date());

  return (
    <div data-testid="NextSalah" className="next-salah-container" key={salah?.name}>
      <div id="js-next-prayer">Iqamah: {salah?.name} {formatAsHoursMinutes(salah?.time)}</div>
      <span className="badge badge-pill badge-warning" id="js-next-prayer-from-now">{label}</span>
    </div>
  )
}
export default NextSalah;
