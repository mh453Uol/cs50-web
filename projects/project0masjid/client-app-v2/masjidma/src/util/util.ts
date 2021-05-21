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

        const now = new Date();
        now.setHours(hour, minute, 0, 0);

        return now;
    }

    return new Date();
}