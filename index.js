const rbp = require('./build/Release/rectangle_bin_pack');

var a = [{
	w: 10,
	h: 10
}, {
	w: 25,
	h: 25
}, {
	w: 15,
	h: 15
}];

//rbp.solve(a, (err, result) => {
//	console.log(result);	
//});

try {
	rbp.solve();
} catch (e) {
	console.log(e);
}

//console.log(rbp.solveSync({"algorithm": "BSSF"}, a));
//console.log(a);
