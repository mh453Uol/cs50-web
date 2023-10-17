import { useEffect, useLayoutEffect, useState } from 'react';

import Header from '../../components/Header/Header';

import { Tenant } from '../../models/Tenant';
import { addDays, getBrowserVisibilityProp } from '../../util/util';
import { getJamaatTimes, getPrayerStartTimes } from '../../services/prayertime/Prayertime.service';

import { JamaatTime } from '../../models/JamaatTime';
import { PrayerTime } from '../../models/PrayerTime';
import Table from '../../components/Table/Table';
import BookmarkInstruction from '../../components/BookmarkInstruction/BookmarkInstruction';
import Announcements from '../Announcement/Announcement';
import LiveBanner from '../LiveBanner/LiveBanner';
import RamadanIftar from '../RamadanIftar/RamadanIftar';

interface State {
  date: Date,
  isLoading: boolean,
  salah?: {
    jamaat: JamaatTime,
    start: PrayerTime
  }
}

const Home = ({ tenant }: { tenant: Tenant }) => {

  const [config, setConfig] = useState<State>({ isLoading: true, date: new Date(), salah: undefined });

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      // When the browser tab is visible set the salah state causing a rerender of the header and table
      // which will update the next salah.
      setConfig(prevState => {
        return {
          ...prevState,
          salah: prevState.salah,
        };
      });
    }
  }


  useEffect(() => {
    const getSalahTime = () => {
      setConfig(prevState => { return { ...prevState, isLoading: true } });

      return Promise.all([
        getJamaatTimes(config.date),
        getPrayerStartTimes(config.date),
      ]);
    }

    getSalahTime()
      .then(([jamaat, startTime]) => {
        setConfig(prevState => {
          return {
            ...prevState,
            isLoading: false,
            salah: { jamaat: jamaat, start: startTime }
          }
        });
      });
  }, [config.date]);

  useLayoutEffect(() => {
    document.addEventListener(getBrowserVisibilityProp(), onVisibilityChange);

    return () => document.removeEventListener(getBrowserVisibilityProp(), onVisibilityChange);
  }, []);


  const onYesterdayClick = () => {
    const yesterday = addDays(-1, config.date);

    setConfig(prevState => {
      return {
        ...prevState,
        date: yesterday,
        isLoading: true
      }
    });
  }

  const onTomorrowClick = () => {
    const tomorrow = addDays(1, config.date);

    setConfig(prevState => {
      return {
        ...prevState,
        date: tomorrow,
        isLoading: true
      }
    });
  }

  const isRamadan = () => {
    return tenant?.displayRamadanTimes;
  }


  return (
    <div data-testid="Home">
      <p className="lead text-center m-2">{tenant?.description}</p>

      <LiveBanner tenant={tenant} />

      <Announcements
        tenant={tenant}
        date={config.date} />

      {isRamadan() &&
        <RamadanIftar
          tenant={tenant}
          date={config.date}
          suhoor={config.salah?.start?.fajr}
          iftar={config.salah?.start?.maghrib} />
      }

      <Table salah={config.salah} />

      <Header
        date={config.date}
        isLoading={config.isLoading}
        salah={config.salah}
        onYesterdayClick={() => onYesterdayClick()}
        onTomorrowClick={() => onTomorrowClick()} />

      <BookmarkInstruction />
    </div>
  );
}
export default Home;
