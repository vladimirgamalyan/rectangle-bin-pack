var expect = require('chai').expect;
var rbp = require('../build/Release/rectangle_bin_pack');

describe('rectangleBinPack', function () {
	
	it('basic call', function (done) {
		rbp.solve([{w:64, h:64}], function (err, res) {
			expect(err).to.be.null;
			expect(res).to.be.an('array').with.lengthOf(1);
			expect(res).to.deep.equal([{x:0, y:0, i:0}]);
			done();
		});
	});
});
