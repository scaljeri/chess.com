export interface IBrowserContext {
    port: number;
    remote: boolean; // play inside the browser if true
    opponent: 'komodo' | 'computer';
    websocketPort: number;
}