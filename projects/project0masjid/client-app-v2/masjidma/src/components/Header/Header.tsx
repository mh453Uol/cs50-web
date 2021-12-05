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
                        <button onClick={props.onYesterdayClick} className="btn btn-light yesterday" type="button" aria-label="yesterday (-1)">-1</button>

                        {header(props)}

                        <button onClick={props.onTomorrowClick} className="btn btn-light tomorrow" type="button" aria-label="tomorrow (+1)">+1</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Header;
