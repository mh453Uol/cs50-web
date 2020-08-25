import prayerTimeService from './prayertimes.service';
import { escapeHtml, todayDate, toUTC, isSameDate } from './util'
import { JamaatTimes } from './models/jamaat-times';
import { DailyPrayerTimes } from './models/daily-prayer-times';
import { config, setTenant, } from './app-config' 

let state = {
    dailyPrayerTimes: new DailyPrayerTimes(),
    jamaatTimes: new JamaatTimes(),
    isLoading: true,
    date: toUTC(new Date())
}

function initialize() {
    
    onYesterdayButtonClicked();
    setTenantDetails();
    
    console.log(state);

    isLoading(true);

    Promise.all([
        prayerTimeService.getJamaatTimes(state.date),
        prayerTimeService.getPrayerTimes(state.date)
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

        const dailyTimes = new DailyPrayerTimes();
        dailyTimes.setFajr(daily.fajr);
        dailyTimes.setDhuhr(daily.dhuhr);
        dailyTimes.setAsr(daily.asr);
        dailyTimes.setMaghrib(daily.maghrib);
        dailyTimes.setIsha(daily.isha);
        dailyTimes.setSunrise(daily.sunrise);
        dailyTimes.setDahwaKubra(daily.dahwakubra);
        
        state.jamaatTimes = jamaatTimes;
        state.dailyPrayerTimes = dailyTimes;

        setPrayerTimes();
        
        const next = state.jamaatTimes.getNextPrayer();
        
        // if the date is today we show the duration view otherwise show the date.
        // We do this since if the user clicks the left yesterday button we display the date 
        // so the user can easily see that the times are not for today.
        const today = toUTC(new Date());

        if (isSameDate(state.date, today)) {
            setNextPrayerTitle(`(Jamaat) ${next.name}`);
            setNextPrayerDuration(next.duration);
        } else {
            setNextPrayerTitle(state.date.toLocaleDateString());
            setPrayerDurationBadgeVisibility(false);
        }
        console.log(state);

    });
}

function isLoading(boolean) {
    if (boolean) {
        state.isLoading = boolean;
        setNextPrayerTitle(escapeHtml("Loading..."));
        setPrayerDurationBadgeVisibility(false);
    } else {
        state.isLoading = boolean;
        setPrayerDurationBadgeVisibility(true);
    }
}
function nextPrayerLabelEl() {
    return document.querySelector("#js-next-prayer")
}

function setNextPrayerTitle(name) {
    nextPrayerLabelEl().innerHTML = escapeHtml(name);
}

function nextPrayerDurationBadgeEl() {
    return document.querySelector("#js-next-prayer-from-now");
}

function setPrayerDurationBadgeVisibility(boolean) {
    if (boolean) {
        nextPrayerDurationBadgeEl().classList.remove("d-none");
    } else {
        nextPrayerDurationBadgeEl().classList.add("d-none");
    }
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

function onYesterdayButtonClicked() {
    document.querySelector(".yesterday").addEventListener("click", () => {
        state.date.setTime(state.date.getTime() - 1000 * 60 * 60 * 24);
        
        initialize();
    });
}


export default {
    initialize,
    state
}