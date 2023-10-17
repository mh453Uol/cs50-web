import { JamaatTime } from '../../models/JamaatTime';
import { PrayerTime } from '../../models/PrayerTime';
import { isSameDate, toUTC } from '../../util/util';
import NextSalah from '../NextSalah/NextSalah';
import './Header.css';

interface Props {
    date: Date,
    isLoading: boolean,
    salah?: {
        jamaat: JamaatTime,
        start: PrayerTime
    },
    onYesterdayClick: () => void,
    onTomorrowClick: () => void
}

const LoadingComponent = () => <div id="js-next-prayer">Loading...</div>;

const DateComponent = ({ date }: { date: Date }) => (
    <div id="js-next-prayer">
        {date.toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })}
    </div>
);

const header = ({ isLoading, date, salah }: {
    isLoading: boolean, date: Date, salah?: {
        jamaat: JamaatTime,
        start: PrayerTime
    },
}) => {
    const today = toUTC(new Date());

    if (isLoading) {
        return LoadingComponent();
    }

    if (isSameDate(date, today)) {
        return <NextSalah salah={salah}></NextSalah>
    } else {
        return DateComponent({ date: date })
    }
}


const Header = ({ onYesterdayClick, onTomorrowClick, isLoading, date, salah }: Props) => (
    <div data-testid="Header">
        <div className="next-salah-container">
            <div className="card">
                <div className="card-body" style={{ padding: "0.25rem" }}>
                    <div className="card-text next-salah">
                        <button onClick={onYesterdayClick} className="btn btn-light yesterday" type="button" aria-label="yesterday (-1)">
                            {/* Left Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" style={{ verticalAlign: "-.125em" }} viewBox="0 0 16 16">
                                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                            </svg>
                        </button>

                        {header({isLoading, date, salah})}

                        <button onClick={onTomorrowClick} className="btn btn-light tomorrow" type="button" aria-label="tomorrow (+1)">
                            {/* Right Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" style={{ verticalAlign: "-.125em" }} viewBox="0 0 16 16">
                                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Header;
