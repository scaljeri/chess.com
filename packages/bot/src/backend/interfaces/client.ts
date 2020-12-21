export interface IClient {
    execute: (cb: (...args: any[]) => void, ...args) => void;
    close: () => Promise<void>;
		goto: (url: string) => Promise<void>;
		click: (selector: string) => Promise<void>;
		upload: () => Promise<void>
		select: (selector: string, value: string) => Promise<void>;
}
