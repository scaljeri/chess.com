export const COMPUTER_DEFAULTS = {
        GAME_STARTED: '.resign-button-component',
        GRID_NAME: '.coordinates > text',
        CHESS_PIECES: '.board .piece',
        LEGAL_MOVES: '.legal-move-hint',
        TRANSLATE_RE: 'translate\((\d+)px, (\d+)(?:px|%)\)',
        MOVES_LIST: 'vertical-move-list-component > div', 
        MOVE_TURN: '.node', // TODO: not used
				MOVE_ITEMS: '.node',
        SETTINGS: '.subcontrols',
        SETTINGS_LEVEL: '.icon-circle-gearwheel',
        TOP_INFO:  '.board-player-top',
        BOTTOM_INFO: '.board-player-bottom',
        // PLAYER_DETAILS: '.board-player-userTagline',
        CLOCK_BOTTOM: '#main-clock-bottom',
        CLOCK_TOP: '#main-clock-top',
				END_DIALOG: '.modal-game-over-component',
        END_DIALOG_MSG: '.header-title-component',
        PROMOTE_PIECE: '.promotion-menu [data-type=', 
        DRAW_DIALOG: '.draw-offer-buttons',
        DRAW_DECLINE: '.draw-offer-decline',
        DRAW_ACCEPT: '.draw-offer-accept',
        ACTION_AREA: '.board-player-bottom .clock-component', // .game-controls-component'

        BOARD_NAME: '.board',
				CLOCK: '.layout-bottom-player .move-time-content',
				CLOCK_OPP: '.layout-top-player .move-time-content',
				CLOCK_ACTIVE: ':not(.move-time-inactive)',
				RESIGN_BTN: '.resign-button-label',
				
				// new ---
				PLAYER_DETAILS: '.layout-bottom-player', // Name + clock
				PLAYER_CLOCK_INACTIVE: '.move-time-inactive'
}

/*
.draw-offer-buttons
        .draw-offer-decline
        .draw-offer-accept

==================
.board-controls
   .game-controls-component
   */
