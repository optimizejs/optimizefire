var optimizeSource = require('../../target/optimize');
var assert = require('assert');

describe('Optimize test', function () {
    it('optimize source', function () {
        assert.strictEqual(optimizeSource('4.0 * 3;'), '12;');
    });
});
