import * as express from 'express';
import * as fs from 'fs';

const app = express();

app.use('/games', (req, res) => {
    const output = [];
    fs.readdirSync('./output').forEach(file => {
        output.push(file);
    });

    res.send(JSON.stringify(output));
});

app.use('/data/:gameId', (req, res) => {
    // res.send('yes ' + req.params.gameId);
    const output = fs.readFileSync(`./output/${req.params.gameId}.json`, 'utf8');
    res.send(output);
});
app.use('/', express.static('./dist'));

app.listen(3001);
console.log('listening on http://localhost:3001');