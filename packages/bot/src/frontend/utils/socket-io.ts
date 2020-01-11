// import * as socketIo from 'socket.io-client';
// import { Game, Move } from '@scaljeri/chess-shared';
// import { Observable } from 'rxjs';

// export class SocketService {
//     private socket;
//     private callback: (m: Move) => void;

//     constructor(socketPort: number) {
//         this.socket = socketIo(`http://localhost:${socketPort}`);

//         this.onMove().subscribe((move: Move) => {
//             if (this.callback) {
//                 this.callback(move);
//                 this.callback = null;
//             }
//         });
//     }

//     async send(game: Game): Promise<Move> {
//         this.socket.emit('move', game);

//         return new Promise<Move>(r => {
//             this.callback = r;
//         });
//     }

//     public onMove(): Observable<Move> {
//         return new Observable<Move>(observer => {
//             this.socket.on('move', (data: Move) => observer.next(data));
//         });
//     }

//     public onEvent(event: Event): Observable<any> {
//         return new Observable<Event>(observer => {
//             this.socket.on(event, () => observer.next());
//         });
//     }
// }