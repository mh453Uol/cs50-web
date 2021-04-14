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
        return date.toLocaleString("en-GB", {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: "h12"
        })
    }

    //console.warn(`Cant format ${date} to hh:mm`);
}

function timeAgo(date) {
    const value = { hours: 0, minutes: 0 };
    if (date instanceof Date) {

        const now = new Date();

        // Milliseconds to Seconds 1 mili = 0.001 hence dividing by 1000
        let seconds = Math.abs((date.getTime() - now.getTime()) / 1000);

        // whole days
        const days = Math.floor(seconds / (60 * 60 * 24));
        seconds -= days * (60 * 60 * 24);

        // whole hours e.g 1
        const hours = Math.floor(seconds / (60 * 60)) % 24;
        seconds -= hours * (60 * 60);

        // whole minutes
        const minutes = Math.round(seconds / 60) % 60;
        seconds -= minutes * 60;

        value.days = days;
        value.hours = hours;
        value.minutes = minutes;
    }

    return value;
}

function addDays(wholeDays, date) {
    if (!(date instanceof Date)) {
        console.warn("Cannot addDays() to object which is not a date", date);
        return;
    }
    date.setTime(date.getTime() + (wholeDays * (1000 * 60 * 60 * 24)));
}

function toUTC(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
}

function isSameDate(date1, date2) {
    return date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate()
}

function inRange(date, start, end) {
    const predicate = (date >= start) && (date <= end);
    console.log(date, start, end);
    return predicate;
}

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function ordinalSuffixOf(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

/**
 * Get the value of a querystring
 * @param  {String} field The field to get the value of
 * @param  {String} url   The URL to get the value from (optional)
 * @return {String}       The field value
 */
var getQueryString = function (field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
};

export {
    escapeHtml,
    fromTextualTimeToDate,
    formatAsHoursMinutes,
    timeAgo,
    toUTC,
    isSameDate,
    addDays,
    getQueryString,
    inRange,
    dateDiffInDays,
    ordinalSuffixOf
}