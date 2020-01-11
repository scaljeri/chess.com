export interface IClient {
    execute: (cb: (...args: any[]) => void, ...args) => void;
    close: () => Promise<void>;
    goto: (url: string) => Promise<void>
    login: () => Promise<void>
    upload: () => Promise<void>
}