import { Announcement } from './Annoucement';

export interface Tenant {
  name: string;
  id: number;
  address: string;
  displayRamadanTimes: boolean;
  ramadanStart: Date;
  ramadanEnd: Date;
  ramadanTimetable: string;
  sehri?: string;
  iftar?: string;
  announcements: Announcement[]
  description?: string;
  donationLink?: string;
}