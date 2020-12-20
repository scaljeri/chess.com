import { IBrowserSettings } from '../../../../models/browser-settings';
import { getS } from '../../../utils/find';
import { convertTimeToMilli } from '@scaljeri/chess-shared';

let settings: IBrowserSettings;

declare var window

export function getTimeOpponent(): number {
    return getTime(getSettings().CLOCK_TOP);
}

export function getTimeBot(): number {
    return getTime(getSettings().CLOCK_BOTTOM);
}

function getSettings(): IBrowserSettings {
    if (!settings) {
        settings = window.__.get('settings');
    }

    return settings;
}

function getTime(selector): number {
    const clock = getS(selector);

    return convertTimeToMilli(clock.innerText);
} 