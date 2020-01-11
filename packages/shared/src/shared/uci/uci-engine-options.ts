export enum UCI_OPTIONS {
    THREADS = 'Threads',
    PONDER = 'Ponder',
    MOVE_OVERHEAD = 'Move Overhead',
    CONTEMPT = 'Contempt',
    HASH = 'Hash',
    SLOW_MOVER = 'Slow Mover',
    STYLE = 'Style'
}

// this.child.stdin.write('setoption name Threads value 2\n');                                                                                                               
//         this.child.stdin.write('setoption name Ponder value true\n');
//         this.child.stdin.write('setoption name Move Overhead value 200\n');
//         this.child.stdin.write('setoption name Contempt value 0\n');
//         this.child.stdin.write('setoption name Hash value 1024\n');
//         this.child.stdin.write('setoption name Slow Mover value 50\n');