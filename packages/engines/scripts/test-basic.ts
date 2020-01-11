import * as io from 'socket.io-client';

const socket = io.connect('http://localhost:5000', { reconnect: true });

// Add a connect listener
socket.on('connect', function () {
    console.log('Connected!');

    socket.emit('move', {
        fen: 'r6k/2R5/6R1/pp1Ppp2/8/Pn2B1Pr/4KP2/8 w - -  0 30',
        skipBook: true,
        options: { movetime: 1000 }
    });
});



