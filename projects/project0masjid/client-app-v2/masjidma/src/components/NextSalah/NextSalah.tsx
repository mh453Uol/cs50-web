import React from "react";
import { JamaatTime } from '../../models/JamaatTime';
import { PrayerTime } from '../../models/PrayerTime';
import { timeAgo } from "../../util/util";

import './NextSalah.css';

interface Props {
  salah?: {
    jamaat: JamaatTime,
    start: PrayerTime
  }
}

interface State {
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

class NextSalah extends React.Component<Props, State> {

  componentDidMount() {    
    this.setState({
      salah: this.props?.salah
    })
  }


  render() {
    const salah = this.state?.salah?.jamaat.getNextSalah();
    const label = getDurationTillNextSalah(salah?.time || new Date());
    const time = salah?.time.toLocaleString("en-GB", { hour: 'numeric', minute: 'numeric', hourCycle: "h12" });


    return (
      <div data-testid="NextSalah" className="next-salah-container" key={salah?.name}>
        <div id="js-next-prayer">Next Jamaat: {salah?.name} {time}</div>
        <span className="badge badge-pill badge-warning" id="js-next-prayer-from-now">{label}</span>
      </div>
    )
  }
}
export default NextSalah;
