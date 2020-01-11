import { Statistics } from '../models/statistics';
import { Side } from '@scaljeri/chess-shared';

declare var google;

export function drawLineChart(data: Statistics, selector: string, gameId: number) {
  google.charts.load('current', { packages: ['line'] });
  google.charts.setOnLoadCallback(() => drawChart(data, selector, gameId));
}

function drawChart(stats: Statistics, selector: string, gameId: number) {
  const data = stats.data;
  const isWhite = stats.color === Side.w;
  const Ponderhits = stats.ponderHits;
  const bookMoves = stats.bookMoves;

  var dt = new google.visualization.DataTable();
  dt.addColumn('number', 'Turns');
  dt.addColumn('number', isWhite ? 'Bot (White)' : 'Chess.com (White)');
  dt.addColumn('number', isWhite ? 'Chess.com (Black)' : 'Bot (Black)');
  dt.addColumn('number', 'Score');

  const multiplier = isWhite ? 1 : -1;
  const outputA = [];
  const outputB = [];
  let turn = 1;

  let row = [];
  row.push(0);
  row.push(60);
  row.push(null);
  row.push(null);
  outputA.push(row);

  row = [];
  row.push(0);
  row.push(null);
  row.push(60);
  row.push(0);
  outputB.push(row);

  for (let i = 0; i < data.length - 1; i += 2) {
    let row = [];
    row.push(turn);
    row.push(data[i].clock === 60 ? 59 : data[i].clock);
    row.push(null);
    row.push(null);
    outputA.push(row);

    row = [];
    row.push(turn);
    row.push(null);
    row.push(data[i + 1].clock);
    row.push(multiplier * data[i + 1].score);
    outputB.push(row);
    turn++;
  }

  dt.addRows(outputA);
  dt.addRows(outputB);

  // const options = {
  //   chart: {
  //     title: `Game Statistics (chess.com game-id: ${gameId})`,
  //     subtitle: 'in millions of dollars (USD)'
  //   },
  //   width: 900,
  //   height: 500,
  //   series: {
  //       0: { axis: 'duration' },
  //       1: { axis: 'duration' },
  //       3: { axis: 'score'}
  //   },
  //   axes: {
  //     // Adds labels to each axis; they don't have to match the axis names.
  //     y: {
  //       duration: {
  //         label: 'Remaining time (seconds)',
  //       },
  //       score: {
  //         label: 'Game score'
  //       }
  //     },
  //   },
  // };

  const classicOptions = {
    width: 900,
    height: 500,
    series: {
      1: { targetAxisIndex: 0 },
      2: { targetAxisIndex: 1 },
    },
    // title: `Game Statistics (chess.com game-id: ${gameId})`,
    vAxes: {
      0: { title: 'Remaining time (seconds)', logScale: false },
      1: {
        title: 'Game score',
        logScale: false,
        mirrorLog: true,
        viewWindow: {
          max: 500,
        },
      },
    },
    hAxes: {
      0: { title: 'Turns' },
    },
    colors: [isWhite ? '00ff00' : 'ff0000', isWhite ? 'ff0000' : '00ff00', 'a9a9a9'],
  };

  // var chart = new google.charts.Line(document.getElementById(selector));
  const chart = new google.visualization.LineChart(document.getElementById(selector));
  // chart.draw(dt, google.charts.Line.convertOptions(classicOptions));
  chart.draw(dt, classicOptions);

  const isDraw = stats.winner === undefined;
  const wonByBot = stats.winner === stats.color;
  const winStr = isDraw ? 'draw' : wonByBot ? 'won' : 'lost';
  document.querySelector('#chart-title').innerHTML = `Game Statistics (${winStr})`;
  document.querySelector(
    '#chart-subtitle',
  ).innerHTML = `Book moves: ${bookMoves}, Ponderhits: ${Ponderhits}, URL: chess.com/live?g=${gameId}`;
}
