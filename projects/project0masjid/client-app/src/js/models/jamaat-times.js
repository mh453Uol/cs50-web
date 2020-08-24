import {
    fromTextualTimeToDate,
    formatAsHoursMinutes,
    timeAgo
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

    getNextPrayer() {
        const now = new Date().getTime();
        let value = { name: '', duration: '00h 00m'};
        let salah = null;

        if (this.fajr && now < this.fajr.getTime()) {
            salah = this.fajr;
            value.name = "Fajr";
        } else if (this.dhuhr && now < this.dhuhr.getTime()) {
            salah = this.dhuhr;
            value.name = "Dhuhr";
        } else if (this.asr && now < this.asr.getTime()) {
            salah = this.asr;
            value.name = "Asr";
        } else if (this.maghrib && now < this.maghrib.getTime()) {
            salah = this.maghrib;
            value.name = "Maghrib";
        } else if (this.isha && now < this.isha.getTime()) {
            salah = this.isha;
            value.name = "Isha";
        } else {
            // Completed all salahs for today so value is tomorrow Fajr
            salah = this.fajr;
            value.name = "Fajr";
        }

        if (salah) {
            const duration = timeAgo(salah);
            value.duration = `${duration.hours}h ${duration.minutes}m`
        }

        return value;
    }

}