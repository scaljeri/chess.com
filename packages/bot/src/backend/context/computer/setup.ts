import { DI, Injectable } from 'di-xxl';

@Injectable({ name: 'backend.computer.setup', singleton: true })
export class SetupComputer {
	init(): void {
		DI.setProjection({
			'navigation': 'backend.computer.navigation',
		}); 
	}
}
