import { getS } from './find';

export function isPlaying(): boolean {
    return !!getS('.vertical-move-list-component');
}