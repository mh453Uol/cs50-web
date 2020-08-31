import { NextSalahComponent } from "./views/home/next-salah.component";

function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function fromTextualTimeToDate(hhmm) {
    if (/[0-9][0-9]:[0-9][0-9]/.test(hhmm)) {
        const hour = parseInt(`${hhmm[0]}${hhmm[1]}`, 10);
        const minute = parseInt(`${hhmm[3]}${hhmm[4]}`, 10);

        const now = new Date();
        now.setHours(hour, minute, 0, 0);

        return now;
    }

    console.warn(`Cant convert ${hhmm} to Date`);
}

function formatAsHoursMinutes(date) {
    if (date instanceof Date) {
        return date.toLocaleString("en-us", {
            hour12: true,
            hour: 'numeric',
            minute: 'numeric'
        })
    }

    //console.warn(`Cant format ${date} to hh:mm`);
}

function timeAgo(date) {
    const value = {hours: 0, minutes: 0};
    if (date instanceof Date) {

        // Date.getTime() always uses UTC for time representation.
        // Sometime we are UTC+1 so we need to add the offset

        const now = new Date();

        // getTimezoneOffset() if UTC+1 return -60 since we are 60 mins forward UTC 
        //if UTC-1 returns 60 since we are 1 hour 60 mins behind UTC
        // https://stackoverflow.com/questions/21102435/why-does-javascript-date-gettimezoneoffset-consider-0500-as-a-positive-off
        const utcOffsetInMilliseconds = now.getTimezoneOffset() * (1000 * 60);

        // TODO: Investigate why sometime the duration is off
        //now.setTime(now.getTime() - (utcOffsetInMilliseconds))

        // Milliseconds to Seconds 1 mili = 0.001 hence dividing by 1000
        const seconds = Math.abs((date.getTime() - now) / 1000);
        let minutes = Math.abs(seconds / 60);
        let hours = Math.abs(minutes / 60);

        // e.g minutes is 61 % 60 = 1
        minutes = Math.round(minutes % 60);
        hours = Math.round(hours % 24);

        value.hours = hours;
        value.minutes = minutes;
    }

    return value;
}

function toUTC(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
}

function isSameDate(date1, date2) {
    return  date1.getUTCFullYear() === date2.getUTCFullYear() &&
            date1.getUTCMonth() === date2.getUTCMonth() && 
            date1.getUTCDate() === date2.getUTCDate()
}

export {
    escapeHtml,
    fromTextualTimeToDate,
    formatAsHoursMinutes,
    timeAgo,
    toUTC,
    isSameDate
}