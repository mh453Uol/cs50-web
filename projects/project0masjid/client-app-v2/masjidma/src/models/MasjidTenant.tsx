import { Tenant } from './Tenant';
import { toUTC } from '../util/util';
import { Announcement } from './Annoucement';

export class MasjidTenant implements Tenant {
  constructor({ name, id, displayRamadanTimes = false, ramadanStart, ramadanEnd, ramadanTimetable, announcements = [], description, donationLink, sehri, iftar }: { name: string; id: number; displayRamadanTimes: boolean; ramadanStart: string; ramadanEnd: string; ramadanTimetable: string; announcements?: Announcement[]; description?:string, donationLink?:string, sehri?:string, iftar?:string }) {
    this.name = name;
    this.id = id;
    this.displayRamadanTimes = displayRamadanTimes;
    this.ramadanStart = toUTC(new Date(ramadanStart));
    this.ramadanEnd = toUTC(new Date(ramadanEnd));
    this.ramadanTimetable = ramadanTimetable;
    this.announcements = announcements;
    this.description = description;
    this.donationLink = donationLink;
    this.sehri = sehri;
    this.iftar = iftar;
  }

  name: string;
  id: number;
  displayRamadanTimes: boolean;
  ramadanStart: Date;
  ramadanEnd: Date;
  ramadanTimetable: string;
  announcements: Announcement[];
  description?:string;
  donationLink?: string;
  sehri?: string | undefined;
  iftar?: string | undefined;
}
