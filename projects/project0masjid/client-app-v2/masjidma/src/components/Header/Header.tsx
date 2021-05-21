import React from 'react';
import { isSameDate, toUTC } from '../../util/util';
import './Header.css';

interface Props {
    date: Date,
    isLoading: boolean
}

const LoadingComponent: React.FC<Props> = (props: Props) => <div>Loading...</div>;

const DateComponent: React.FC<Props> = (props: Props) => (
    <div>
        {props.date.toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })}
    </div>
);

const NextSalahComponent: React.FC<Props> = (props: Props) => (
    <h1>Hello</h1>
);


const header = (props: Props) => {
    const today = toUTC(new Date());

    if (props.isLoading) {
        return LoadingComponent(props);
    }

    if (isSameDate(props.date, today)) {
        return NextSalahComponent(props);
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
                        <button className="btn btn-primary yesterday" type="button">
                            <i className="fa fa-caret-left">-1 days</i>
                        </button>

                        <div id="js-next-prayer">
                            {header(props)}
                        </div>

                        <span className="badge badge-pill badge-warning d-none" id="js-next-prayer-from-now">0h 00m</span>
                        <button className="btn btn-primary tomorrow" type="button">
                            <i className="fa fa-caret-right">+1 day</i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Header;
