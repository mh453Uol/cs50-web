import {
    config,
    getApiUrl
} from './prayertimes-app';

async function post(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        // no-cors is set since the api is on another domain and browsers by default block request to a different domain 
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify(data)
    });
    return response;
}

function getPrayerTimes(date) {
    const url = getApiUrl('getprayertimesdaily');
    const textualMonth = date.toLocaleDateString('en-GB', {
        month: 'long'
    });

    post(url, {
        date: date.getDay().toString(),
        month: textualMonth,
        establishid: config.tenant
    }).then(response => console.log(response))
}

function getJamaatTimes(date) {
    const url = getApiUrl('getprayertimesjamaat');
    const textualMonth = date.toLocaleDateString('en-GB', {
        month: 'long'
    });

    post(url, { establishid: config.tenant }).then(response => console.log(response))
}

export default {
    getPrayerTimes,
    getJamaatTimes
}