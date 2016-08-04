const rectangleBinPack = require('./build/Release/rectangle_bin_pack');

var a = [{
	w: 12,
	h: 42
}, {
	w: 2,
	h: 34
}, {
	w: 22,
	h: 24
}];

rectangleBinPack.solve(a, (err, result) => {
	console.log(result);	
});
