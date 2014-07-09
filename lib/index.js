(function() {

// Constructor

function Set(universe, members) {
	if(!(this instanceof Set)) return new Set(universe, members);
	if(typeof members === 'undefined') {
		members = universe;
		universe = Everything;
	}
	this.setUniverse(universe);
	this.setMembers(members);
}

Set.prototype.setUniverse = function(universe) {
	if(universe !== UniversalComplex &&
	 !(universe instanceof Set)) universe = Set(universe);
	this.universe = universe;
	return this;
}

Set.prototype.setMembers = function(members) {
	var U = this.universe;
	if(Array.isArray(members)) {
		this._members = members;
		members = _contains.bind(null, members);
	}
	this.hasMember = function(x) {
		return U.contains(x) && members(x);
	};
	return this;
}

// Operations 

Set.prototype.contains = function(x) {
	if(x instanceof Set) return this.isSupersetOf(x);
	return this.hasMember(x);
}

function _contains(array, element) {
	return _indexOf(array, element) !== -1;
}

Set.prototype.union = function(B) {
	var A = this;
	return Set(function(x) {
		return A.contains(x) || B.contains(x);
	});
}

Set.prototype.intersect = function(B) {
	var A = this;
	return this.subset(function(x) {
		return B.contains(x);
	});
}

Set.prototype.difference = function(B) {
	var A = this;
	return this.subset(function(x) {
		return !B.contains(x);
	});
}

Set.prototype.symmetricDifference = function(B) {
	var A = this;
	return Set(function(x) {
		return A.contains(x) !== B.contains(x);
	});
}

Set.prototype.cartesianProduct = function(B) {
	var A = this;
	return Set(function(x) {
		var a = x[0],
			b = x[1];
		return (
			(A.contains(a) || B.contains(a)) &&
			(B.contains(b) || A.contains(b))
		);
	});
}

Set.prototype.complement = function() {
	var U = this.universe,
		A = this;
	return Set(function(x) {
		return U.contains(x) && !A.contains(x);
	});
}

Set.prototype.inverse = function() {
	var A = this;
	return Set(function(x) {
		return !A.contains(x);
	});
}

// Comparison

Set.prototype.isSupersetOf = function(B, y) {
	var A = this;
	return prove(function(x) {
		return A.contains(x) && B.contains(x);
	}, y);
}

Set.prototype.isSubsetOf = function(B, y) {
	var A = this;
	return prove(B.isSupersetOf(A).fx, y);
}

Set.prototype.isProperSubsetOf = function(B, y) {
	var A = this,
		AB = A.isSubsetOf(B),
		BA = B.isSubsetOf(A);
	return prove(function(x) {
		return AB.fx(x) && !BA.fx(x);
	}, y);
}

Set.prototype.isComplementOf = function(B, y) {
	var U = this.universe,
		A = this;
	return prove(function(x) {
		return U.contains(x) && (A.contains(x) !== B.contains(x));
	}, y);
}

Set.prototype.isInverseOf = function(B, y) {
	var A = this;
	return prove(function(x) {
		return A.contains(x) !== B.contains(x);
	}, y);
}

// Proof Class

function prove(fx, x) {
	if(typeof x === 'undefined') return Proof(fx);
	if(Array.isArray(x)) return Proof(fx).confirmsAll(x);
	return Proof(fx).confirms(x);
}

function Proof(fx) {
	if(!(this instanceof Proof)) return new Proof(fx);
	this.fx = fx;
}

Proof.prototype.confirms = function(x) {
	return this.fx(x);
}

Proof.prototype.confirmsAll = function(xs) {
	var F = this;
	return xs.reduce(function(s, x) {
		return s === false ? s : F.confirms(x); 
	}, true);
}

Proof.prototype.confirmsAllExcept = function(xs) {
	var F = this,
		exceptions = [];
	xs.forEach(function(x) {
		if(!F.confirms(x)) exceptions.push(x);
	});
	return exceptions;
}

Proof.prototype.testArray = function(xs) {
	return xs.map(this.confirms.bind(this));
}

Proof.prototype.toString = function() {
	return "[object Proof]";
}


// Utilities

Set.prototype.subset = function(members) {
	return Set(this, members);
}

Set.prototype.toString = function() {
	return "[object Set]";
}

Set.prototype.toDebugString = function() {
	if(!this._members) return this.toString();
	return "[object Set("+JSON.stringify(this._members)+")]";
}

// Shims

if(!Array.isArray) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

function _indexOf(array, el) {
	if(Array.prototype.indexOf) return array.indexOf(el);
	var len = array.length;
	for (var i = 0; i < len; i++) {
		if (array[i] === el) return i;
	}
	return -1;
}

// Exports

var Seth = {Set: Set, Proof: Proof};

/*
	Seth is designed to have every set have a universe, even if it is Everything.
	UniversalComplex is an hack to allow this as a Universe of Everything requires a Universe.
	It's complexicated.
*/
var UniversalComplex = {
	contains: function(x) {return true;}
};

var Everything = 
Seth.Everything = Set(UniversalComplex, function(x) {return true;});

Seth.Nothing = 
Seth.Empty = Set(function(x) {return false;});

Seth.R = 
Seth.Numbers = Set(function(x) {
	return typeof x === 'number';
});

Seth.Z = 
Seth.Integers = Set(Seth.R, function(x) {
	return x % 1 === 0;
});

(function(name, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else this[name] = definition();
}('seth', function() {
    return Seth;
}));

}).call(this);
