export const LIVE_DEFAULTS = {
        GAME_STARTED: '.resign-button-component',
        GRID_NAME: '.coordinates > div',
        CHESS_PIECES: '.pieces .piece',
        LEGAL_MOVES: '.legal-move-hint',
        TRANSLATE_RE: 'translate\((\d+)px, (\d+)(?:px|%)\)',
        MOVES_LIST: '.vertical-move-list-component > div', 
        MOVE_TURN: '.vertical-move-list-notation-vertical',
        MOVE_ITEMS: ':scope > span:not(.vertical-move-list-timestamps):not(.vertical-move-list-num)',
        SETTINGS: '.subcontrols',
        SETTINGS_LEVEL: '.icon-circle-gearwheel',
        TOP_INFO:  '.board-player-top',
        BOTTOM_INFO: '.board-player-bottom',
        PLAYER_DETAILS: '.board-player-userTagline',
        CLOCK_BOTTOM: '#main-clock-bottom',
        CLOCK_TOP: '#main-clock-top',
        END_DIALOG: '.board-dialog-component',
        END_DIALOG_MSG: '.header-title-component',
        PROMOTE_PIECE: '.promotion-menu [data-type=', 
        DRAW_DIALOG: '.draw-offer-buttons',
        DRAW_DECLINE: '.draw-offer-decline',
        DRAW_ACCEPT: '.draw-offer-accept',
        ACTION_AREA: '.board-player-bottom .clock-component', // .game-controls-component'

        BOARD_NAME: '#game-board',
        CLOCK: '#board-layout-player-bottom .clock-component',
        CLOCK_OPP: '#board-layout-player-top .clock-component',
        CLOCK_ACTIVE: '.clock-playerTurn',
        RESIGN_BTN: '.resign-button-label',
}

/*
.draw-offer-buttons
        .draw-offer-decline
        .draw-offer-accept

==================
.board-controls
   .game-controls-component
   */