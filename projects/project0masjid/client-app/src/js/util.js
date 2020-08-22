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

    console.warn(`Cant format ${date} to hh:mm`);

}
export {
    escapeHtml,
    fromTextualTimeToDate,
    formatAsHoursMinutes
}