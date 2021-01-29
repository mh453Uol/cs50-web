import prayerTimeService from '../../prayertimes.service';
import {
  escapeHtml,
  toUTC,
  isSameDate,
  addDays
} from '../../util';
import {
  JamaatTimes
} from '../../models/jamaat-times';
import {
  DailyPrayerTimes
} from '../../models/daily-prayer-times';
import {
  config,
  setTenant
} from '../../app-config';
import prayerTable from './prayer-table.component';
import {
  NextSalahComponent
} from './next-salah.component';

let state = {
  dailyPrayerTimes: new DailyPrayerTimes(),
  jamaatTimes: new JamaatTimes(),
  isLoading: true,
  date: toUTC(new Date()),
  nextSalah: {},
  interval: null
};

let nextSalahComponent = new NextSalahComponent();

onYesterdayButtonClicked();
onTomorrowButtonClicked();

function initialize() {
  setTenantDetails();

  isLoading(true);

  prayerTable.isLoading(true);

  Promise.all([
    prayerTimeService.getJamaatTimes(state.date),
    prayerTimeService.getPrayerTimes(state.date),
  ]).then(([jamaat, daily]) => {
    isLoading(false);

    state.jamaatTimes = getJammatTimes(jamaat);
    state.dailyPrayerTimes = getDailyPrayerTimes(daily);

    prayerTable.setPrayerTimes(state.dailyPrayerTimes, state.jamaatTimes);

    onUpdateView();

    document.addEventListener("visibilitychange", () => {
      onVisibilityChange();
    });

  });
}

function isLoading(boolean) {
  state.isLoading = boolean;

  if (boolean) {
    nextSalahComponent.label = escapeHtml('Loading...');
    nextSalahComponent.durationBadgeVisible = false;
  } else {
    nextSalahComponent.durationBadgeVisible = true;
  }
}

function getJammatTimes(jamaat) {
  const jamaatTimes = new JamaatTimes();
  jamaatTimes.setFajr(jamaat.fajr);
  jamaatTimes.setDhuhr(jamaat.dhuhr);
  jamaatTimes.setAsr(jamaat.asr);
  jamaatTimes.setMaghrib(jamaat.maghrib);
  jamaatTimes.setIsha(jamaat.isha);
  jamaatTimes.setJummah1(jamaat.jummah1);
  jamaatTimes.setJummah2(jamaat.jummah2);

  return jamaatTimes;
}

function getDailyPrayerTimes(daily) {
  const dailyTimes = new DailyPrayerTimes();
  dailyTimes.setFajr(daily.fajr);
  dailyTimes.setDhuhr(daily.dhuhr);
  dailyTimes.setAsr(daily.asr);
  dailyTimes.setMaghrib(daily.maghrib);
  dailyTimes.setIsha(daily.isha);
  dailyTimes.setSunrise(daily.sunrise);
  dailyTimes.setDahwaKubra(daily.dahwakubra);

  return dailyTimes;
}

function setTenantDetails() {
  // Set the tenant dropdown
  const dropdownEl = document.querySelector('#tenant-dropdown');
  dropdownEl.innerHTML = getTenantDropdownEl();

  // register the onclick event for the dropdown items so when we click we set the different tenant
  const dropdownItemEl = document.querySelectorAll(
    '#tenant-dropdown .dropdown-item'
  );
  
  for(let i = 0; i < dropdownItemEl.length; i++) {
    dropdownItemEl[i].addEventListener('click', () => changeTenant(dropdownItemEl[i].dataset.tenantId));
  }

  // Set the tenant name in the navbar
  const el = document.querySelector('.establishment-name');
  el.innerHTML = config.getTenantName();
}

function getTenantDropdownEl() {
  let el = '';

  let isSelectedTenant = (tenant, selectedTenant) => {
    if (tenant.id === selectedTenant) {
      return 'active';
    } else {
      return '';
    }
  };

  config.tenants.forEach((tenant) => {
    el += `<div class="dropdown-item ${isSelectedTenant(tenant, config.tenant)}" 
            data-tenant-id="${tenant.id}">
                ${escapeHtml(tenant.name)}
            </div>`;
  });

  return el;
}

function getConfigurationDropdownEl() {
  let el = `<div class="dropdown-item">${escapeHtml(tenant.name)}</div>`;

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
  const el = document.querySelector('.yesterday');

  el.addEventListener('click', function () {
    addDays(-1, state.date);
    initialize();
  });
}

function onTomorrowButtonClicked() {
  const el = document.querySelector('.tomorrow');

  el.addEventListener('click', function () {
    addDays(1, state.date);
    initialize();
  });
}

function setNextSalahComponent() {
  // if the date is today we show the duration view otherwise show the date.
  // We do this since if the user clicks the left yesterday button we display the date
  // so the user can easily see that the times are not for today.
  const today = toUTC(new Date());

  if (isSameDate(state.date, today)) {
    nextSalahComponent.label = `${state.nextSalah.name} ${state.nextSalah.time}`;
    nextSalahComponent.durationLabel = state.nextSalah.duration;
    nextSalahComponent.durationBadgeVisible = true;
  } else {
    nextSalahComponent.label = state.date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    nextSalahComponent.durationBadgeVisible = false;
  }
}

function highlightSalahRow(rowName) {
  rowName = rowName.split(" ").join("-").toLowerCase();
  const row = document.querySelector(`.js-${rowName}-row`);

  row.classList.add('table-active');
}

function unhighlightSalahRow() {
  const row = document.querySelector(`tr.table-active`);

  if (row) {
    row.classList.remove('table-active');
  }
}

function updateNextSalahComponents() {
  const nextSalah = state.jamaatTimes.getNextPrayer();

  state.nextSalah = nextSalah;

  setNextSalahComponent();
}

function onUpdateView() {
  updateNextSalahComponents();

  if (isSameDate(state.date, new Date())) {
    unhighlightSalahRow();
    highlightSalahRow(state.nextSalah.name);
  }
}

/**
 * When the user switches tab and comes back recompute the next salah and highlighting the salah row.
 */
function onVisibilityChange() {

  if (document.visibilityState == 'visible') {
    onUpdateView();
  }

}


export default {
  initialize,
  state,
};