import '../../css/stylev2.css';

import {initialize, config} from '../app-config';

window.addEventListener('load', function () {
    initialize();

    const tenant = config.getTenant();

    document.querySelector('#ramadan-header').innerHTML = `${tenant.name} Ramadan 2021`;

    if (tenant.ramadanTimetable) {
        document.querySelector('#ramadan-timetable-container').classList.remove('d-none');
        document.querySelector('#ramadan-timetable-container > a').href = `${tenant.ramadanTimetable}`;
        document.querySelector('#ramadan-timetable').src = `${tenant.ramadanTimetable}`;
    }

    const el = document.querySelector('.establishment-name');
    el.innerHTML = config.getTenant().name;
});