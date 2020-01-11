
// Example from ps 
//luca             15706   0.0  1.2  4855992 103928 s003  S+    9:57AM   0:04.95 /Applications/Google Chrome.app/Contents/MacOS/Google Chrome --debug-devtools --disable-ba

const psaux = require('psaux');
const kill  = require('tree-kill');

psaux().then(list => {  
   list.forEach(p => {
     if (p.command.match(/Google Chrome.*--debug-devtools/)) {
       kill(p.pid);
     }
   });
});