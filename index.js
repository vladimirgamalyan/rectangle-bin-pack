const rbp = require('./build/Release/rectangle_bin_pack');

var a = [{w: 10, h: 10}, {w: 25, h: 25}, {w: 15,h: 15}];
rbp.solveSync({w: 50, h: 25}, a);
console.log(a);
