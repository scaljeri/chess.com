export function jsonToString(json: any): string {
    return JSON.stringify(json, 
        function(key, val) {
            return (typeof val === 'function') ? '' + val : val;
        }
    );
}