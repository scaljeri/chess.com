export interface IBrowserSettings {
    GAME_STARTED: string;
    GRID_NAME: string;
    TOP_INFO: string;
    BOTTOM_INFO: string;
    CLOCK_BOTTOM: string;
    CLOCK_ACTIVE: string;
    CLOCK_TOP: string;
    MOVE_TURN: string;
    PROMOTE_PIECE: string;
    DRAW_DIALOG?: string;
    DRAW_DECLINE?: string;
    DRAW_ACCEPT?: string;
    ACTION_AREA: string;

    BOARD_NAME: string;
    CLOCK?: string;
    CLOCK_OPP?: string;
		RESIGN_BTN?: string;

		// new
		PLAYERS: string,
		PLAYER_DETAILS: string;
		OPP_DETAILS: string,
		CLOCK_TIMELEFT: string;
		CLOCK_INACTIVE: string;
		PLAYER_CLOCK_INACTIVE: string;
    MOVES_LIST: string;
		MOVES_LIST_TURN: string;
		GAME_OVER: string;
}
