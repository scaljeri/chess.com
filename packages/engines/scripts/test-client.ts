import { ClientTCP } from '@nestjs/microservices';
import {Game, Side} from '@scaljeri/chess-shared';

(async () => {
    const client = new ClientTCP({
        host: 'localhost',
        port: 5000,
    });

    await client.connect();

    const pattern = { cmd: 'move' };
    const data: Game = {
        bot: Side.Black,
        moves: [ 
            { from: 'd2', to: 'd4', color: Side.w}, 
            { from: 'd7', to: 'd5', color: Side.b}, 
            { from: 'c2', to: 'c4', color: Side.w} ],
        timeBlack: 300000,
        timeWhite: 300000
    };

    const result = await client.send(pattern, data).toPromise();
    console.log('Response:', result);

    client.close();
})();

