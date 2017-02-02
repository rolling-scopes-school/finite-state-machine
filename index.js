const FSM = require('./src/fsm.js');
const config = require('./test/config');

window.FSM = FSM;
window.student = new FSM(config);
