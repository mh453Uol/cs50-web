

import { Tenant } from '../../models/Tenant';
import { addDays, getBrowserVisibilityProp, isPwaInstalled } from '../../util/util';

import { JamaatTime } from '../../models/JamaatTime';
import { PrayerTime } from '../../models/PrayerTime';
import { useEffect, useLayoutEffect, useState } from 'react';
import { getJamaatTimes, getPrayerStartTimes } from '../../services/prayertime/Prayertime.service';
import LiveBanner from '../LiveBanner/LiveBanner';
import Announcements from '../Announcement/Announcement';
import RamadanIftar from '../RamadanIftar/RamadanIftar';
import Header from '../Header/Header';
import BookmarkInstruction from '../BookmarkInstruction/BookmarkInstruction';
import Table from '../Table/Table';
import Donate from '../Donate/Donate';

export interface State {
  date: Date,
  isLoading: boolean,
  salah?: {
    jamaat: JamaatTime,
    start: PrayerTime
  }
}

export const onVisibilityChange = (setState: React.Dispatch<React.SetStateAction<State>>) => {
  if (document.visibilityState === 'visible') {
    // When the browser tab is visible set the salah state causing a rerender of the header and table
    // which will update the next salah.
    setState(prevState => {
      return {
        ...prevState,
        salah: prevState.salah,
      };
    });
  }
}

export const onYesterdayClick = (date: Date, setState: React.Dispatch<React.SetStateAction<State>>) => {
  const yesterday = addDays(-1, date);

  setState(prevState => {
    return {
      ...prevState,
      date: yesterday,
      isLoading: true
    }
  });
}

export const onTomorrowClick = (date: Date, setState: React.Dispatch<React.SetStateAction<State>>) => {
  const tomorrow = addDays(1, date);

  setState(prevState => {
    return {
      ...prevState,
      date: tomorrow,
      isLoading: true
    }
  });
}

export const isRamadan = (tenant: Tenant) => {
  return tenant.displayRamadanTimes;
}

export const isJummah = (config: State) => {
  const salah = config.salah?.jamaat.getNextSalah().name || '';

  return salah === "1st Jummah" || salah === "2nd Jummah";
}

const Home = ({ tenant }: { tenant: Tenant; }) => {

  const [config, setConfig] = useState<State>({ isLoading: true, date: new Date(), salah: undefined });

  useEffect(() => {
    const getSalahTime = () => {
      setConfig(prevState => { return { ...prevState, isLoading: true, salah: undefined }; });

      return Promise.all([
        getJamaatTimes(config.date),
        getPrayerStartTimes(config.date),
      ]);
    };

    getSalahTime()
      .then(([jamaat, startTime]) => {
        setConfig(prevState => {
          return {
            ...prevState,
            isLoading: false,
            salah: { jamaat: jamaat, start: startTime }
          };
        });
      });
  }, [config.date]);

  useLayoutEffect(() => {
    document.addEventListener(getBrowserVisibilityProp(), () => onVisibilityChange(setConfig));

    return () => document.removeEventListener(getBrowserVisibilityProp(), () => onVisibilityChange(setConfig));
  }, []);

  return (
    <div data-testid="Home">
      <h4 className="text-center m-2">{tenant?.description}</h4>

      <Announcements
        tenant={tenant}
        date={config.date} />

      {isRamadan(tenant) &&
        <RamadanIftar
          tenant={tenant}
          date={config.date}
          suhoor={config.salah?.start?.fajr}
          iftar={config.salah?.start?.maghrib} />}

      <Table salah={config.salah} />

      <Header
        date={config.date}
        isLoading={config.isLoading}
        salah={config.salah}
        onYesterdayClick={() => onYesterdayClick(config.date, setConfig)}
        onTomorrowClick={() => onTomorrowClick(config.date, setConfig)} />

      <LiveBanner tenant={tenant} />

      {tenant.donationLink && <Donate tenant={tenant}></Donate>}

      {isJummah(config) &&
        <div className="text-center">
          <img className="img-fluid" src="./jummah-checklist-4.png" loading="lazy" alt="jummah sunnah checklist"></img>
        </div>}

      {!isPwaInstalled() && <BookmarkInstruction />}
    </div>
  );
};

export default Home;
