const path = require('path');
const fs = require('fs');

// This is for the web server

require('ts-node').register();

let file = path.resolve(__dirname, 'main-di.');

try {
    if (fs.existsSync(`${file}ts`)) {
        file += 'ts';
    } else {
        file += 'js';
    }
  } catch(err) {
    console.error(err)
  }

require(file);