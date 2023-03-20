import { Announcement } from "../Annoucement";
import { Tenant } from "../Tenant";

export class FakeTenant implements Tenant {
    name: string;
    id: number;
    displayRamadanTimes: boolean;
    ramadanStart: Date;
    ramadanEnd: Date;
    ramadanTimetable: string;
    announcements: Announcement[];
  
    constructor() {
      this.name = '';
      this.id = 1;
      this.displayRamadanTimes = false;
      this.ramadanStart = new Date();
      this.ramadanEnd = new Date();
      this.ramadanTimetable = '';
      this.announcements = [];
    }
  }