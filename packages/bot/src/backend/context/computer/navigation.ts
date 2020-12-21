import { Injectable, Inject } from 'di-xxl';
import { INavigationOpponent } from '../../../models/navigation-opponent';
import { IClient } from '../../interfaces/client';
import { IContext } from '../../interfaces/context';

@Injectable('backend.computer.navigation')
export class ComputerNavigation implements INavigationOpponent {
	@Inject('backend.client') client: IClient;
	@Inject('context') context: IContext;

	async go() {
		await this.client.goto('https://www.chess.com/play/computer');
		await this.client.click('.icon-font-chess.modal-seo-close-icon');
		await this.client.click('button.close'); // Cookie bar footer
		await this.client.click('.bot-selection-scroll > div:last-child');
		await this.client.click('.selection-menu-footer');
		await this.client.click('.mode-selection-mode > div:last-child');
		await this.client.select('.ui_v5-select-component.mode-selection-custom-select', this.context.duration)
	}
}
