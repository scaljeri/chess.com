import { getGameIds } from './game-list';
import { drawLineChart } from './draw-line-chart';
import { Statistics } from '../models/statistics'

declare var google;

const CHESS_COM = 'https://www.chess.com/live#g=';

// Namespace
const ns: any = {};
(<any>window)._ = ns

google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(async() => {
    ns.gameIds = await getGameIds();
});

// Callbacks
window['load'] = async function (gameId) {
    const response = await fetch(`/data/${gameId}`);
    const data = await response.json() as Statistics;
    drawLineChart(data, 'chart-moves-durtation', gameId);
    document.querySelector('#goto-element').setAttribute('href', `${CHESS_COM}${gameId}`);
    // drawLineChart(data, 'chart-moves-elo');
}

window['goto'] = function(gameId) {
    window.open('https://www.chess.com/live#g=4346305674', '_blank');
}
