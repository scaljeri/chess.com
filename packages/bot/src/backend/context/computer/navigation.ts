import { Injectable, Inject } from 'di-xxl';
import { INavigationOpponent } from '../../../models/navigation-opponent';
import { IClient } from '../../interfaces/client';
import { IContext } from '../../interfaces/context';

@Injectable('backend.computer.navigation')
export class ComputerNavigation implements INavigationOpponent {
	@Inject('client') client: IClient;
	@Inject('context') context: IContext;

	async go() {
		await this.client.goto('https://www.chess.com/play/computer');

		// await this.client.click('.icon-font-chess.modal-seo-close-icon');
		await this.client.click('.ui_outside-close-icon');
		// await this.client.click('button.close'); // Cookie bar footer
		await (this.client as any).scrollIntoView('.bot-selection-scroll > div:last-child');
		await this.client.waitUntilVisible('.bot-selection-scroll > div:last-child img').$();
		await this.client.click('.bot-selection-scroll > div:last-child img');

		await this.client.execute((strenght) => {
			const input = document.querySelector('.slider-component input') as HTMLInputElement;
			input.value = strenght || '24';
			input.dispatchEvent(new Event('change'));
			input.dispatchEvent(new Event('input'));
		}, this.context.opponentStrength);

		// await new Promise(r => {});
		await this.client.click('.selection-menu-footer');
		await this.client.waitUntilVisible('.mode-selection-mode > div:last-child').$();
		await this.client.click('.mode-selection-mode > div:last-child');

		
		await this.client.select('.ui_v5-select-component.mode-selection-custom-select', this.context.duration)
		// await this.client.removeElement('#tall-sidebar-ad'); // Remove Ad
	}
}
