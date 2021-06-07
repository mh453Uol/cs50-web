/**
 * Get the value of a querystring
 * @param  {String} field The field to get the value of
 * @param  {String} url   The URL to get the value from (optional)
 * @return {String}       The field value
 */
export const getQueryString = (field: string, url: string) => {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
};

export const toUTC = (date: Date) => {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
}

export const isSameDate = (date1: Date, date2: Date) => {
    return date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate()
}

export function fromTextualTimeToDate(hhmm: string) {
    if (/[0-9][0-9]:[0-9][0-9]/.test(hhmm)) {
        const hour = parseInt(`${hhmm[0]}${hhmm[1]}`, 10);
        const minute = parseInt(`${hhmm[3]}${hhmm[4]}`, 10);

        const now = toUTC(new Date());
        now.setHours(hour, minute, 0, 0);

        return now;
    }

    return new Date();
}

export function addDays(wholeDays: number, date: Date): Date {
    const copy = new Date();
    copy.setTime(date.getTime() + (wholeDays * (1000 * 60 * 60 * 24)));

    return copy;
}

export function inRange(date: Date, start: Date, end: Date) {
    const predicate = (date >= start) && (date <= end);
    return predicate;
}

export function timeAgo(date: Date) {
    const value = { days: 0, hours: 0, minutes: 0 };
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
  
    return value;
}



export function getBrowserVisibilityProp() {
    const browser: any = document;
    if (typeof browser.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      return "visibilitychange"
    } else if (typeof browser.msHidden !== "undefined") {
      return "msvisibilitychange"
    } else if (typeof browser.webkitHidden !== "undefined") {
      return "webkitvisibilitychange"
    }

    return "visibilitychange";
  }

