import hijriDateService from './hijri-date.service';

window.addEventListener('load', function () {
    const millisecondsInADay = 86400000;

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

    displayTime();
    displayDate();
    displayHijriDate();


    // Then after every second update time
    this.setInterval(displayTime, 1000);
    // After every day update date
    this.setInterval(() => {
        displayDate();
        displayHijriDate();
    }, millisecondsInADay);

});