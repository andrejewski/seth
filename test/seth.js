
var Seth = require('../'),
	assert = require('assert');

describe("Seth", function() {
	describe("#Set()", function() {
		it('should be the class constructor for Sets', function() {
			assert.ok(!(Seth.Set instanceof Seth.Set));
			assert.ok(Seth.Set([]) instanceof Seth.Set);
		});
	});
	describe("#Proof()", function() {
		it('should be the class constructor for Proofs', function() {
			var fx = function(x) {return !!x;};
			assert.ok(!(Seth.Proof instanceof Seth.Proof));
			assert.ok(Seth.Proof(fx) instanceof Seth.Proof);
		});
	});
	commonSet("Everything", [0,1,true,false,"yes","no"], [true, true, true, true, true, true]);
	commonSet("Nothing", [0,1,true,false,"yes","no"], [false, false, false, false, false, false]);
	commonSet("Numbers", [0,1,true,false,"yes","no"], [true, true, false, false, false, false]);
	commonSet("Integers", [0, 1, 0.5, 1.5, 2], [true, true, false, false, true]);
});

function commonSet(name, arrayIn, arrayOut) {
	describe("."+name, function() {
		var set = Seth[name];
		it('should be a Set', function() {
			assert.ok(set instanceof Seth.Set);
		});
		it('should contain '+name.toLowerCase(), function() {
			var p = Seth.Proof(set.contains.bind(set));
			assert.deepEqual(arrayOut, p.testArray(arrayIn));
		})
	});
}

