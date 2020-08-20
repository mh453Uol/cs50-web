import {
    config,
} from './app-config';

async function getPrayerTimes(date) {
    const url = `${config.apiUrl}/daily?${date.toISOString()}`;

    const headers = {
        'Content-Type': 'application/json'
    };

    return fetch(url, {
            headers: headers
        })
        .then(response => response.json())
}

async function getJamaatTimes(date) {
    const url = `${config.apiUrl}/jamaat`;
    const headers = {
        'Content-Type': 'application/json'
    };

    return fetch(url, {
            headers: headers
        })
        .then(response => response.json())

}

export default {
    getPrayerTimes,
    getJamaatTimes
}