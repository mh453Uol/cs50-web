import prayerTimeService from './prayertimes.service';

let state = {
    dailyPrayerTimes: {},
    jamaatTimes: {},
    isLoading: true,
    textPrayerLabel: 'Loading...',
    textPrayerDurationLabel: ''
}

async function initialize() {
    const today = new Date();

     Promise.all([
        prayerTimeService.getJamaatTimes(today),
        prayerTimeService.getPrayerTimes(today)
    ]).then(([daily, jamaat]) => {

        state.dailyPrayerTimes = daily;
        state.jamaatTimes = jamaat;
    
        
    })
}

function nextPrayerLabelEl() {
    return document.querySelector('#js-next-prayer')
}

function getNextPrayerTime() {
    
}

export default { initialize, state }