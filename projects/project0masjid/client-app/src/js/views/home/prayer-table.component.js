import { escapeHtml } from '../../util'
import { JamaatTimes  } from '../../models/jamaat-times';
import { DailyPrayerTimes } from '../../models/daily-prayer-times';

/**
 * Set the prayer times in the table
 */
function setPrayerTimes(dailyPrayerTimes, jamaatTimes) {
    let startTimeSelector = (salah) => {
        return `#js-${salah}-start`
    }
    let jamaatSelector = (salah) => {
        return `#js-${salah}-jamaat`
    }

    document.querySelector(startTimeSelector('fajr')).innerHTML = escapeHtml(dailyPrayerTimes.getFajr());
    document.querySelector(jamaatSelector('fajr')).innerHTML = escapeHtml(jamaatTimes.getFajr());

    document.querySelector(startTimeSelector('sunrise')).innerHTML = escapeHtml(dailyPrayerTimes.getSunrise());
    document.querySelector(jamaatSelector('sunrise')).innerHTML = escapeHtml(dailyPrayerTimes.getSunrise());

    document.querySelector(startTimeSelector('dahawa-kubra')).innerHTML = escapeHtml(dailyPrayerTimes.getDahwaKubra());
    document.querySelector(jamaatSelector('dahawa-kubra')).innerHTML = escapeHtml(dailyPrayerTimes.getDahwaKubra());

    document.querySelector(startTimeSelector('dhuhr')).innerHTML = escapeHtml(dailyPrayerTimes.getDhuhr());
    document.querySelector(jamaatSelector('dhuhr')).innerHTML = escapeHtml(jamaatTimes.getDhuhr());

    document.querySelector(startTimeSelector('asr')).innerHTML = escapeHtml(dailyPrayerTimes.getAsr());
    document.querySelector(jamaatSelector('asr')).innerHTML = escapeHtml(jamaatTimes.getAsr());

    document.querySelector(startTimeSelector('magrib')).innerHTML = escapeHtml(dailyPrayerTimes.getMaghrib());
    document.querySelector(jamaatSelector('magrib')).innerHTML = escapeHtml(jamaatTimes.getMaghrib());

    document.querySelector(startTimeSelector('isha')).innerHTML = escapeHtml(dailyPrayerTimes.getIsha());
    document.querySelector(jamaatSelector('isha')).innerHTML = escapeHtml(jamaatTimes.getIsha());

    document.querySelector(jamaatSelector('jummah1')).innerHTML = escapeHtml(jamaatTimes.getJummah1());
    document.querySelector(jamaatSelector('jummah2')).innerHTML = escapeHtml(jamaatTimes.getJummah2());
}

function isLoading(boolean) {
    if (boolean) {
        setPrayerTimes(new DailyPrayerTimes(), new JamaatTimes());
    }
}

export default { setPrayerTimes, isLoading }
