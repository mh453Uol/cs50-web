import React from 'react';
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

const LoadingComponent: React.FC<Props> = (props: Props) => <div id="js-next-prayer">Loading...</div>;

const DateComponent: React.FC<Props> = (props: Props) => (
    <div id="js-next-prayer">
        {props.date.toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })}
    </div>
);

const header = (props: Props) => {
    const today = toUTC(new Date());

    if (props.isLoading) {
        return LoadingComponent(props);
    }

    if (isSameDate(props.date, today)) {
        return <NextSalah salah={props.salah}></NextSalah>
    } else {
        return DateComponent(props)
    }
}


const Header: React.FC<Props> = (props: Props) => (
    <div data-testid="Header">
        <div className="next-salah-container">
            <div className="card">
                <div className="card-body" style={{ padding: "0.25rem" }}>
                    <div className="card-text next-salah">
                        <button onClick={props.onYesterdayClick} className="btn btn-primary yesterday" type="button" aria-label="yesterday (-1)">
                            {/* Left Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" style={{verticalAlign: "-.125em"}} viewBox="0 0 16 16">
                                <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                            </svg>
                        </button>

                        {header(props)}

                        <button onClick={props.onTomorrowClick} className="btn btn-primary tomorrow" type="button" aria-label="tomorrow (+1)">
                            {/* Right Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" style={{verticalAlign: "-.125em"}} viewBox="0 0 16 16">
                                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Header;
