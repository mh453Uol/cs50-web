import {
    fromTextualTimeToDate,
    formatAsHoursMinutes,
    timeAgo,
    addDays
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
        let value = { name: '', time: '', duration: '0d 00h 00m'};
        let salah = null;
        
        if (this.fajr && now <= this.fajr.getTime()) {
            salah = this.fajr;
            value.name = "Fajr";
            value.time = this.getFajr();
        } else if (this.dhuhr && now <= this.dhuhr.getTime()) {
            salah = this.dhuhr;
            value.name = "Dhuhr";
            value.time = this.getDhuhr();
        } else if (this.asr && now <= this.asr.getTime()) {
            salah = this.asr;
            value.name = "Asr";
            value.time = this.getAsr();
        } else if (this.maghrib && now <= this.maghrib.getTime()) {
            salah = this.maghrib;
            value.name = "Maghrib";
            value.time = this.getMaghrib();
        } else if (this.isha && now <= this.isha.getTime()) {
            salah = this.isha;
            value.name = "Isha";
            value.time = this.getIsha();
        } else {
            // Completed all salahs for today so value is tomorrow Fajr
            // Since its Fajr tomorow we add 1 day to the fajr time
            salah = this.fajr;
            addDays(1, salah);
            value.name = "Fajr";
            value.time = this.getFajr();
        }

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
        // 0 = Sunday, 1 = Monday, ... , 5 = Friday = 5, Sunday = 6
        const isFriday = new Date().getDay() == 5;

        if (isFriday) {
            if (this.jummah1 && now <= this.jummah1.getTime()) {
                salah = this.jummah1;
                value.name = "1st Jummah";
                value.time = this.getJummah1();
            } else if (this.jummah2 && now <= this.jummah2.getTime()) {
                salah = this.jummah2;
                value.name = "2nd Jummah";
                value.time = this.getJummah2();
            } 
        }

        if (salah) {
            const duration = timeAgo(salah);
            const days = duration.days ? `${duration.days}d` : "";
            const hours = duration.hours ? `${duration.hours}h` : "";
            const minutes = `${duration.minutes}m`;
            value.duration = `${days} ${hours} ${minutes}`
        }

        return value;
    }

}