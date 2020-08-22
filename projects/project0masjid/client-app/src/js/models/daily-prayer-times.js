import {
    JamaatTimes
} from "./jamaat-times";

import {
    fromTextualTimeToDate,
    formatAsHoursMinutes
} from '../util';

export class DailyPrayerTimes extends JamaatTimes {
    constructor() {
        super();
    }

    getSunrise() {
        return formatAsHoursMinutes(this.sunrise) || "-";
    }

    setSunrise(sunrise) {
        this.sunrise = fromTextualTimeToDate(sunrise);
    }

    getDahwaKubra() {
        return formatAsHoursMinutes(this.dahwakubra) || "-";
    }

    setDahwaKubra(dahwakubra) {
        this.dahwakubra = fromTextualTimeToDate(dahwakubra);
    }
}