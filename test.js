const rbp = require('.');

var a = [{w: 10, h: 10}, {w: 60, h: 60}, {w: 10, h: 10}];
rbp.solveSync({w: 50, h: 50}, a);
console.log(a);
