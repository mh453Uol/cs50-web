import { Announcement } from './Annoucement';

export interface Tenant {
  name: string;
  id: number;
  displayRamadanTimes: boolean;
  ramadanStart: Date;
  ramadanEnd: Date;
  ramadanTimetable: string;
  announcements: Announcement[]
  description?: string;
  donationLink?: string;
}