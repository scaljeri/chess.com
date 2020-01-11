### Weights

By default a weight file best for CPU is used. This file was downloaded from 

    https://mega.nz/#!6dwTwCxb!pYlo7A9xiVT7csP-V2lqBTmrss5EOhda5NiEG51wD4Y

But there are other weights available. I've added a couple from 

    https://github.com/dkappe/leela-chess-weights.git

which can be listed as follows

    $> docker run --rm jeanluca/leela-chess-zero list

If there is one you like use it like

    $> docker run --rm -e WEIGHT=<WEIGHT_FILE_NAME> -it jeanluca/leela-chess-zero engine

### Settings

    --slowmover=                 Scale thinking time                   (default: 2.4  min: 0  max: 100)
    --move-overhead=             Move time overhead in milliseconds    (default: 100  min: 0  max: 10000)
    --time-curve-peak=           Time weight curve peak ply            (default: 26.2  min: -1000  max: 1000)
    --time-curve-left-width=     Time weight curve width left of peak  (default: 82  min: 0  max: 1000)
    --time-curve-right-width=    Time weight curve width right of peak (default: 74  min: 0  max: 1000)
    --futile-search-aversion=    Aversion to search if change unlikely (default: 1.33  min: 0  max: 10)

### Bookmarks

    * Code: https://github.com/leela-zero/leela-zero
    * Docker setup: https://github.com/LeelaChessZero/lc0/wiki/Leela-Self-play-in-Docker
    * CUDA image: https://github.com/NVIDIA/nvidia-docker 
    *: http://blog.lczero.org/
