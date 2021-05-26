import { addDays, timeAgo } from "../util/util";

export interface IJamaatTime {
    fajr: Date,
    dhuhr: Date,
    asr: Date,
    maghrib: Date,
    isha: Date,
    jummah1: Date,
    jummah2: Date
}


export class JamaatTime implements IJamaatTime {

    fajr: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
    jummah1: Date;
    jummah2: Date;

    constructor(fajr: Date, dhuhr: Date, asr: Date, maghrib: Date, isha: Date,
        jummah1: Date, jummah2: Date) {
        this.fajr = fajr;
        this.dhuhr = dhuhr;
        this.asr = asr;
        this.maghrib = maghrib;
        this.isha = isha;
        this.jummah1 = jummah1;
        this.jummah2 = jummah2;
    }

    getNextSalah() {
        const now = new Date().getTime();
        let value = { time: new Date(), name: '' };
        let salah = null;
        
        if (now <= this.fajr.getTime()) {
            salah = this.fajr;
            value.name = "Fajr";
        } else if (now <= this.dhuhr.getTime()) {
            salah = this.dhuhr;
            value.name = "Dhuhr";
        } else if (now <= this.asr.getTime()) {
            salah = this.asr;
            value.name = "Asr";
        } else if (now <= this.maghrib.getTime()) {
            salah = this.maghrib;
            value.name = "Maghrib";
        } else if (now <= this.isha.getTime()) {
            salah = this.isha;
            value.name = "Isha";
        } else {
            // Completed all salahs for today so value is tomorrow Fajr
            // Since its Fajr tomorow we add 1 day to the fajr time
            const tomorrowFajr = addDays(1, this.fajr);
            salah = tomorrowFajr;
            value.name = "Fajr";
        }

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
        // 0 = Sunday, 1 = Monday, ... , 5 = Friday = 5, Sunday = 6
        const isFriday = new Date().getDay() == 5;

        if (isFriday) {
            if (now <= this.jummah1.getTime()) {
                salah = this.jummah1;
                value.name = "1st Jummah";
            } else if (now <= this.jummah2.getTime()) {
                salah = this.jummah2;
                value.name = "2nd Jummah";
            } 
        }

        if (salah) {
            // const duration = timeAgo(salah);
            // const days = duration.days ? `${duration.days}d` : "";
            // const hours = duration.hours ? `${duration.hours}h` : "";
            // const minutes = `${duration.minutes}m`;
            // value.duration = `${days} ${hours} ${minutes}`
            value.time = salah;
        }

        return value;
    }

}