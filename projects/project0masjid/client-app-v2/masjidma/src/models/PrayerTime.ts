import { IJamaatTime } from './JamaatTime';

export interface IPrayerTime {
    fajr: Date;
    sunrise: Date;
    dahwakubra: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
}

export class PrayerTime implements IPrayerTime {

    fajr: Date;
    sunrise: Date;
    dahwakubra: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
    
    constructor(fajr: Date, sunrise: Date, dahwaKubra: Date, dhuhr: Date, asr: Date, maghrib: Date, isha: Date) {
        this.fajr = fajr;
        this.sunrise = sunrise;
        this.dahwakubra = dahwaKubra;
        this.dhuhr = dhuhr;
        this.asr = asr;
        this.maghrib = maghrib;
        this.isha = isha;
    }

}