var Redactor = require('../../dist/lib/Redactor');
var expect = require('expect.js');


describe('Build', function() {
    class TextBlock extends Redactor.BaseBlock {}
    TextBlock.prototype.type = 'text';

    class ImageBlock extends Redactor.BaseBlock {}
    ImageBlock.prototype.type = 'image';

    class PostBuild extends Redactor.BaseBuild {}
    PostBuild.prototype.type = 'post';
    PostBuild.prototype.blockTypes = ['text'];

    describe('.push', function() {
        it('should receive allowed blocks', function() {
            var build = new PostBuild();
            
            build.push(new TextBlock());
            expect(build.blocks.__blocks.length).to.be(1);
        });
        it('should not receive disallowed blocks', function() {
            var build = new PostBuild();

            expect(build.push).withArgs(new ImageBlock()).to.throwException();
        });
    });

    describe('.print', function() {
    });
});