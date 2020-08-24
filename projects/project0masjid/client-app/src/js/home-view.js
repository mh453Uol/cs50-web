import prayerTimeService from './prayertimes.service';
import { escapeHtml } from './util'
import { JamaatTimes } from './models/jamaat-times';
import { DailyPrayerTimes } from './models/daily-prayer-times';

let state = {
    dailyPrayerTimes: new DailyPrayerTimes(),
    jamaatTimes: new JamaatTimes(),
    isLoading: true,
    textPrayerLabel: 'Loading...',
    textPrayerDurationLabel: ''
}

async function initialize() {
    const today = new Date();

    Promise.all([
        prayerTimeService.getJamaatTimes(today),
        prayerTimeService.getPrayerTimes(today)
    ]).then(([jamaat, daily]) => {
        console.log(jamaat, daily);

        const jamaatTimes = new JamaatTimes();

        jamaatTimes.setFajr(jamaat.fajr);
        jamaatTimes.setDhuhr(jamaat.dhuhr);
        jamaatTimes.setAsr(jamaat.asr);
        jamaatTimes.setMaghrib(jamaat.maghrib);
        jamaatTimes.setIsha(jamaat.isha);
        jamaatTimes.setJummah1(jamaat.jummah1);
        jamaatTimes.setJummah2(jamaat.jummah2);

        state.jamaatTimes = jamaatTimes;
        
        const dailyTimes = new DailyPrayerTimes();

        dailyTimes.setFajr(daily.fajr);
        dailyTimes.setDhuhr(daily.dhuhr);
        dailyTimes.setAsr(daily.asr);
        dailyTimes.setMaghrib(daily.maghrib);
        dailyTimes.setIsha(daily.isha);
        dailyTimes.setSunrise(daily.sunrise);
        dailyTimes.setDahwaKubra(daily.dahwakubra);

        state.dailyPrayerTimes = dailyTimes;

        setPrayerTimes();
        
        const next = state.jamaatTimes.getNextPrayer();

        setNextPrayerTitle(`Next Jamaat Is ${next.name}`);
        setNextPrayerDuration(next.duration);
    })
}

function nextPrayerLabelEl() {
    return document.querySelector("#js-next-prayer")
}

function isLoading(boolean) {
    state.isLoading = boolean;
    nextPrayerLabelEl().innerHTML = escapeHtml("Loading...");
}

function setNextPrayerTitle(name) {
    nextPrayerLabelEl().innerHTML = escapeHtml(name);
}

function setNextPrayerDuration(duration) {
    const selector = document.querySelector("#js-next-prayer-from-now");
    selector.innerHTML = escapeHtml(duration)
    selector.classList.remove("d-none");
}
/**
 * Set the prayer times in the table
 */
function setPrayerTimes() {
    let startTimeSelector = (salah) => {
        return `#js-${salah}-start`
    }
    let jamaatSelector = (salah) => {
        return `#js-${salah}-jamaat`
    }

    document.querySelector(startTimeSelector('fajr')).innerHTML = escapeHtml(state.dailyPrayerTimes.getFajr());
    document.querySelector(jamaatSelector('fajr')).innerHTML = escapeHtml(state.jamaatTimes.getFajr());

    document.querySelector(startTimeSelector('sunrise')).innerHTML = escapeHtml(state.dailyPrayerTimes.getSunrise());
    document.querySelector(jamaatSelector('sunrise')).innerHTML = escapeHtml(state.dailyPrayerTimes.getSunrise());

    document.querySelector(startTimeSelector('dahawa-kubra')).innerHTML = escapeHtml(state.dailyPrayerTimes.getDahwaKubra());
    document.querySelector(jamaatSelector('dahawa-kubra')).innerHTML = escapeHtml(state.dailyPrayerTimes.getDahwaKubra());

    document.querySelector(startTimeSelector('dhuhr')).innerHTML = escapeHtml(state.dailyPrayerTimes.getDhuhr());
    document.querySelector(jamaatSelector('dhuhr')).innerHTML = escapeHtml(state.jamaatTimes.getDhuhr());

    document.querySelector(startTimeSelector('asr')).innerHTML = escapeHtml(state.dailyPrayerTimes.getAsr());
    document.querySelector(jamaatSelector('asr')).innerHTML = escapeHtml(state.jamaatTimes.getAsr());

    document.querySelector(startTimeSelector('magrib')).innerHTML = escapeHtml(state.dailyPrayerTimes.getMaghrib());
    document.querySelector(jamaatSelector('magrib')).innerHTML = escapeHtml(state.jamaatTimes.getMaghrib());

    document.querySelector(startTimeSelector('isha')).innerHTML = escapeHtml(state.dailyPrayerTimes.getIsha());
    document.querySelector(jamaatSelector('isha')).innerHTML = escapeHtml(state.jamaatTimes.getIsha());

    document.querySelector(jamaatSelector('jummah1')).innerHTML = escapeHtml(state.jamaatTimes.getJummah1());
    document.querySelector(jamaatSelector('jummah2')).innerHTML = escapeHtml(state.jamaatTimes.getJummah2());
}

export default {
    initialize,
    state
}