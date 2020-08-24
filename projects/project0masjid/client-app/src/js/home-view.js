import prayerTimeService from './prayertimes.service';
import { escapeHtml } from './util'
import { JamaatTimes } from './models/jamaat-times';
import { DailyPrayerTimes } from './models/daily-prayer-times';
import { config, setTenant } from './app-config' 

let state = {
    dailyPrayerTimes: new DailyPrayerTimes(),
    jamaatTimes: new JamaatTimes(),
    isLoading: true,
    textPrayerLabel: 'Loading...',
    textPrayerDurationLabel: ''
}

function initialize() {
    
    setTenantDetails();

    isLoading(true);
    
    const today = new Date();

    Promise.all([
        prayerTimeService.getJamaatTimes(today),
        prayerTimeService.getPrayerTimes(today)
    ]).then(([jamaat, daily]) => {
        isLoading(false);
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
        
        setNextPrayerTitle(`(Jamaat) ${next.name}`);
        setNextPrayerDuration(next.duration);
    })
}

function nextPrayerLabelEl() {
    return document.querySelector("#js-next-prayer")
}

function isLoading(boolean) {
    if (boolean) {
        state.isLoading = boolean;
        nextPrayerLabelEl().innerHTML = escapeHtml("Loading...");
        nextPrayerDurationBadgeEl().classList.add("d-none");
    } else {
        state.isLoading = boolean;
        nextPrayerDurationBadgeEl().classList.remove("d-none");
    }
}

function setNextPrayerTitle(name) {
    nextPrayerLabelEl().innerHTML = escapeHtml(name);
}

function nextPrayerDurationBadgeEl() {
    return document.querySelector("#js-next-prayer-from-now");
}

function setNextPrayerDuration(duration) {
    const selector = nextPrayerDurationBadgeEl();
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

function setTenantDetails() {
    // Set the tenant dropdown
    const dropdownEl = document.querySelector("#tenant-dropdown");
    dropdownEl.innerHTML = getTenantDropdownEl();

    // register the onclick event for the dropdown items so when we click we set the different tenant
    const dropdownItemEl = document.querySelectorAll("#tenant-dropdown .dropdown-item");
    dropdownItemEl.forEach((item) => item.addEventListener("click", () => changeTenant(item.dataset.tenantId)));

    // Set the tenant name in the navbar
    const el = document.querySelector(".establishment-name");
    el.innerHTML = config.getTenantName();
};

function getTenantDropdownEl() {
    let el = ""; 

    let isSelectedTenant = (tenant, selectedTenant) => { 
        if (tenant.id === selectedTenant) {
            return "active";
        } else {
            return "";
        }
    };

    config.tenants.forEach((tenant) => {
        el += `<div class="dropdown-item ${isSelectedTenant(tenant, config.tenant)}" 
            data-tenant-id="${tenant.id}">
                ${escapeHtml(tenant.name)}
            </div>`
    })
    
    return el;
}

function changeTenant(tenantId) {
    if (tenantId) {
        // update app-config & local storage
        setTenant(tenantId);
        // reload the prayer times
        initialize();
    }
}


export default {
    initialize,
    state
}