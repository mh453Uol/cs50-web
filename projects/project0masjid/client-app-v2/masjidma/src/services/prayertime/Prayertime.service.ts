import { fromTextualTimeToDate } from './../../util/util';
import configuration from '../../config/config.prod-v2.json';
import { JamaatTime } from '../../models/JamaatTime';
import { PrayerTime } from '../../models/PrayerTime';

export const getApiUrl = () => {
    let template = `${configuration.baseUrl}/api/v2/{{tenant}}`

    let tenant = window.localStorage.getItem('tenant');

    if (tenant === null) {
        tenant = configuration.tenants[0].id.toString();
    }

    return template.replace(/{{tenant}}/g, tenant)
}

export function getPrayerStartTimes(date: Date): Promise<PrayerTime> {
    const dateOnly = date.toISOString().split('T', 1)[0];
    const url = `${getApiUrl()}/prayers/daily?date=${dateOnly}`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return fetch(url, { headers: headers })
        .then(response => response.json())
        .then((data) => {
            return new PrayerTime(
                fromTextualTimeToDate(data.fajr),
                fromTextualTimeToDate(data.sunrise),
                fromTextualTimeToDate(data.dhawakubra),
                fromTextualTimeToDate(data.dhuhr),
                fromTextualTimeToDate(data.asr),
                fromTextualTimeToDate(data.maghrib),
                fromTextualTimeToDate(data.isha)
            )
        }).catch(() => {
            return new PrayerTime(
                fromTextualTimeToDate('06:29'),
                fromTextualTimeToDate('08:11'),
                fromTextualTimeToDate('11:11'),
                fromTextualTimeToDate('12:11'),
                fromTextualTimeToDate('14:15'),
                fromTextualTimeToDate('16:04'),
                fromTextualTimeToDate('17:38')
            )
        })
}

export function getJamaatTimes(date: Date): Promise<JamaatTime> {
    const url = `${getApiUrl()}/prayers/jamaat`;
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
        .catch(() => {
            return new JamaatTime(
                fromTextualTimeToDate('07:00'),
                fromTextualTimeToDate('13:00'),
                fromTextualTimeToDate('14:30'),
                fromTextualTimeToDate('16:04'),
                fromTextualTimeToDate('18:30'),
                fromTextualTimeToDate('12:30'),
                fromTextualTimeToDate('13:30')
            )
        })

}

