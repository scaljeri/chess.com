export function convertTimeToMilli(t: string): number {
    let retVal = 0;

    if (t) {
        if (t.match(/:/)) {
            const [min, sec] = t.split(':');
            retVal = (+min * 60 + +sec) * 1000;
        } else {
            retVal = parseInt(t, 10);
        }
    }

    return retVal;
}