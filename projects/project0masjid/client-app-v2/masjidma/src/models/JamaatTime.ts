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


    fajr: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
    jummah1: Date;
    jummah2: Date;

}