import {
    fromTextualTimeToDate,
    formatAsHoursMinutes
} from '../util';

export class JamaatTimes {
    
    getFajr() {
        return formatAsHoursMinutes(this.fajr) || "-";
    }

    setFajr(fajr) {
        this.fajr = fromTextualTimeToDate(fajr);
    }

    
    getDhuhr() {
        return formatAsHoursMinutes(this.dhuhr) || "-";
    }

    setDhuhr(dhuhr) {
        this.dhuhr = fromTextualTimeToDate(dhuhr);
    }

    getAsr() {
        return formatAsHoursMinutes(this.asr) || "-";
    }

    setAsr(asr) {
        this.asr = fromTextualTimeToDate(asr);
    }

    getMaghrib() {
        return formatAsHoursMinutes(this.maghrib) || "-";
    }

    setMaghrib(maghrib) {
        this.maghrib = fromTextualTimeToDate(maghrib);
    }

    getIsha() {
        return formatAsHoursMinutes(this.isha) || "-";
    }
    
    setIsha(isha) {
        this.isha = fromTextualTimeToDate(isha);
    }
    
    setJummah1(date) {
        this.jummah1 = fromTextualTimeToDate(date);
    }

    getJummah1() {
        return formatAsHoursMinutes(this.jummah1) || "-";
    }

    setJummah2(date) {
        this.jummah2 = fromTextualTimeToDate(date);
    }

    getJummah2() {
        return formatAsHoursMinutes(this.jummah2) || "-";
    }

}