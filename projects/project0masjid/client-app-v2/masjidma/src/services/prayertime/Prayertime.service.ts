import { fromTextualTimeToDate } from './../../util/util';
import configuration from '../../config/config.prod.json';
import { JamaatTime } from '../../models/JamaatTime';
import { PrayerTime } from '../../models/PrayerTime';

const getApiUrl = () => {
    let template = `${configuration.baseUrl}/api/v1/{{tenant}}/prayers`

    const tenant = window.localStorage.getItem('tenant') || "";

    return template.replace(/{{tenant}}/g, tenant)
}

export function getPrayerStartTimes(date: Date): Promise<PrayerTime> {
    const url = `${getApiUrl()}/daily?date=${date.toISOString()}`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return fetch(url, { headers: headers })
        .then(response => response.json())
        .then((data) => {
            return new PrayerTime(
                fromTextualTimeToDate(data.fajr),
                fromTextualTimeToDate(data.sunrise),
                fromTextualTimeToDate(data.dahwakubra),
                fromTextualTimeToDate(data.dhuhr),
                fromTextualTimeToDate(data.asr),
                fromTextualTimeToDate(data.maghrib),
                fromTextualTimeToDate(data.isha)
            )
        })
}

export function getJamaatTimes(date: Date): Promise<JamaatTime> {
    const url = `${getApiUrl()}/jamaat`;
    const headers = {
        'Content-Type': 'application/json'
    };

    return fetch(url, { headers: headers })
        .then(response => response.json())
        .then((data) => {
            return new JamaatTime(
                fromTextualTimeToDate(data.fajr),
                fromTextualTimeToDate(data.dhuhr),
                fromTextualTimeToDate(data.asr),
                fromTextualTimeToDate(data.maghrib),
                fromTextualTimeToDate(data.isha),
                fromTextualTimeToDate(data.jummah1),
                fromTextualTimeToDate(data.jummah2)
            );
        })

}