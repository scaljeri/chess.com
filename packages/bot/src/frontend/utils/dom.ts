import { getS, getM } from './find';
import { Injectable } from 'di-xxl';

@Injectable('browser.dom')
export class DOM {
  private base: HTMLElement;

  constructor(private baseSelector: string) {
  }

  find(selector: string): HTMLElement {
    if (!this.base) {
      this.base = getS(this.baseSelector);
    }

    return getS(selector, this.base);
  }

  findAll(selector: string): HTMLElement[] {
    if (!this.base) {
      this.base = getS(this.baseSelector);
    }

    return Array.prototype.slice.call(getM(selector, this.base));
  }

  async waitForElement(selector: string, timeout = 5000): Promise<HTMLElement | undefined> {
    const startDate = Date.now();

    return new Promise(r => {
      const target = document.querySelector('body');

      const id = setTimeout(() => {
        console.warn('Element not found', selector);
        r(undefined);
      }, timeout);

      // Create a new observer instance:
      const observer = new MutationObserver(function () {
        const el = getS(selector);

        if (el) {
          clearTimeout(id);
          observer.disconnect();
          r(el);
        }
      });

      // Set configuration object:
      const config = { childList: true };

      // Start the observer
      observer.observe(target, config);
    });
  }
}
