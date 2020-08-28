import { escapeHtml } from '../../util';

export class NextSalahComponent {

    constructor() {
        this.state = {
            label: '',
            durationLabel: '',
            durationBadgeVisible: false
        }
    }

    set label(value) {
        this.state.label = value;
        this.nextPrayerLabelEl().innerHTML = escapeHtml(value);
    }

    set durationBadgeVisible(value) {
        this.state.durationBadgeVisible = value;

        if (value) {
            this.nextPrayerDurationBadgeEl().classList.remove("d-none");
        } else {
            this.nextPrayerDurationBadgeEl().classList.add("d-none");
        }
    }

    set durationLabel(duration) {
        const selector = this.nextPrayerDurationBadgeEl();
        selector.innerHTML = escapeHtml(duration)
    }

    nextPrayerLabelEl() {
        return document.querySelector("#js-next-prayer")
    }

    nextPrayerDurationBadgeEl() {
        return document.querySelector("#js-next-prayer-from-now");
    }
}