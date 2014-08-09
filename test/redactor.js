var Redactor = require('../../dist/lib/Redactor');
var expect = require('expect.js');


describe('Redactor', function() {
    var redactor = new Redactor();

    class TextBlock extends Redactor.BaseBlock {}
    TextBlock.prototype.type = 'text';
    class PostBuild extends Redactor.BaseBuild {}
    PostBuild.prototype.type = 'post';

    it('should receive blocks', function() {
        redactor.block(TextBlock);
        expect(redactor.__blocks.text).to.be.equal(TextBlock);
    });
    it('should receive builds', function() {
        redactor.build(PostBuild);
        expect(redactor.__builds.post).to.be.equal(PostBuild);
    });
});