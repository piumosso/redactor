var Redactor = require('../lib/Redactor');
var expect = require('expect.js');


describe('Redactor', function() {
    it('must be an object', function() {
        expect(Redactor).to.be.eql({});
    });
});