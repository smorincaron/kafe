//= require 'bower_components/kafe/dist/number'

(function(kafe,undefined){

	module('kafe.number');


	test('toRoman()', function() {
		var toRoman = function(number,expected) {
			strictEqual( kafe.number.toRoman( number ), expected, number );
		};
		toRoman(1,    'I');
		toRoman(2,    'II');
		toRoman(3,    'III');
		toRoman(4,    'IV');
		toRoman(5,    'V');
		toRoman(6,    'VI');
		toRoman(7,    'VII');
		toRoman(8,    'VIII');
		toRoman(9,    'IX');
		toRoman(10,   'X');
		toRoman(14,   'XIV');
		toRoman(15,   'XV');
		toRoman(16,   'XVI');
		toRoman(23,   'XXIII');
		toRoman(44,   'XLIV');
		toRoman(53,   'LIII');
		toRoman(99,   'XCIX');
		toRoman(101,  'CI');
		toRoman(477,  'CDLXXVII');
		toRoman(956,  'CMLVI');
		toRoman(1111, 'MCXI');
		toRoman(1982, 'MCMLXXXII');
		toRoman(1999, 'MCMXCIX');
		toRoman(2013, 'MMXIII');
	});

	test('getPrecision()', function() {
		var getPrecision = function(number,expected) {
			strictEqual( kafe.number.getPrecision( number ), expected, number + ' = ' + expected );
		};
		getPrecision(5.458,	3);
		getPrecision(2,     0);
	});

	test('trimPrecision()', function() {
		var trimPrecision = function(number,precision,expected) {
			strictEqual( kafe.number.trimPrecision( number, precision ), expected, number + ' trimed to ' + precision + ' = ' + expected );
		};
		trimPrecision(5.458, 2, 5.45);
		trimPrecision(5.458, 0, 5);
		trimPrecision(5.458, 6, 5.458);
	});

	test('product()', function() {
		var product = function(number,factor,expected) {
			strictEqual( kafe.number.product( number, factor ), expected, number + ' * ' + factor + ' = ' + expected );
		};
		product(3, 5.3, 15.9);
	});




})(window.kafe);