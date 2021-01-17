import 'whatwg-fetch'

import hijriDateService from './hijri-date.service';
import '../css/stylev2.css';

import {config, initialize} from './app-config';
import homeview from './views/home/home-view'

window.addEventListener('load', function () {

    initialize();

    homeview.initialize();

    function displayTime() {

        var date = new Date();
        var element = document.getElementById('js-current-time');
        element.innerHTML = date.toLocaleTimeString('en-US');
    }

    function displayDate() {
        var options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        var today = new Date();
        var element = document.getElementById('js-date');
        element.innerHTML = today.toLocaleDateString('en-GB', options);
    }

    function displayHijriDate() {
        var element = document.getElementById('js-hijri-date');
        element.innerHTML = hijriDateService.getTodayHijriDate();
    }

    // displayTime();
    // displayDate();
    // displayHijriDate();


    // // Then after every second update time
    // this.setInterval(displayTime, 1000);
    // // After every day update date
    // this.setInterval(() => {
    //     displayDate();
    //     displayHijriDate();
    // }, millisecondsInADay);

});