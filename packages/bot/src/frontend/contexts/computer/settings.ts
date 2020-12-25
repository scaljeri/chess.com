export const COMPUTER_DEFAULTS = {
	GAME_STARTED: '.resign-button-component',
	CHESS_PIECES: '.board .piece',
	LEGAL_MOVES: '.legal-move-hint',
	TRANSLATE_RE: 'translate\((\d+)px, (\d+)(?:px|%)\)',
	MOVE_TURN: '.node', // TODO: not used
	SETTINGS: '.subcontrols',
	SETTINGS_LEVEL: '.icon-circle-gearwheel',
	TOP_INFO: '.board-player-top',
	BOTTOM_INFO: '.board-player-bottom',
	// PLAYER_DETAILS: '.board-player-userTagline',

	END_DIALOG_MSG: '.header-title-component',
	DRAW_DIALOG: '.draw-offer-buttons',
	DRAW_DECLINE: '.draw-offer-decline',
	DRAW_ACCEPT: '.draw-offer-accept',
	ACTION_AREA: '.board-player-bottom .clock-component', // .game-controls-component'

	BOARD_NAME: '.board',
	// CLOCK: '.layout-bottom-player .move-time-content',
	CLOCK_OPP: '.layout-top-player .move-time-content',
	// CLOCK_ACTIVE: ':not(.move-time-inactive)',
	RESIGN_BTN: '.resign-button-label',

	// new ---
	GRID_NAME: '.coordinates > text',
	PLAYERS: '.layout-player',
	PLAYER_DETAILS: '.layout-bottom-player', // Name + clock
	OPP_DETAILS: '.layout-top-player',  // Name + clock opponent
	CLOCK: '.move-time-time',
	CLOCK_INACTIVE: 'move-time-inactive',
	CLOCK_ACTIVE: '.move-time-time:not(.move-time-inactive)',
	MOVES_LIST: 'vertical-move-list > div',
	MOVES_LIST_TURN: '.node',
	CLOCK_TIMELEFT: '.move-time-content', // Need PLAYER_DETAILS and OPP_DETAILS
	PROMOTE_PIECE: '.promotion-window.top',
	END_DIALOG: '.modal-game-over-component',
	GAME_OVER: '.game-over-modal .modal-game-over-header-component'
}

/*
.draw-offer-buttons
				.draw-offer-decline
				.draw-offer-accept

==================
.board-controls
	 .game-controls-component
	 */
