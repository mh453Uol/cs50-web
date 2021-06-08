import { Announcement } from './Annoucement';
export interface Tenant {
  name: string;
  id: number;
  displayRamadanTimes: boolean;
  ramadanStart: string;
  ramadanEnd: string;
  ramadanTimetable: string;
  announcements: Announcement[];
}