var assert = require('assert');
var rbp = require('../build/Release/rectangle_bin_pack');

describe('rectangleBinPack', function () {
	
	it('basic call', function (done) {
		rbp.solve([{w:64, h:64}], function (err) {
			if (err)
				throw err;
			done();
		});
	});
});
