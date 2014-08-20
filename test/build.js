var Redactor = require('../../dist/lib/Redactor');
var expect = require('expect.js');


describe('Build', function() {
    var redactor = new Redactor();
    var BaseBlock = redactor.getBaseBlock();
    var BaseBuild = redactor.getBaseBuild();

    class TextBlock extends BaseBlock {
        get type() {
            return 'text';
        }
    }

    class ImageBlock extends BaseBlock {
        get type() {
            return 'image';
        }
    }

    class PostBuild extends BaseBuild {
        get type() {
            return 'post';
        }

        get blockTypes() {
            return ['text'];
        }
    }

    redactor.addBlock(TextBlock);
    redactor.addBlock(TextBlock);
    redactor.addBuild(PostBuild);

    describe('.push', function() {
        it('should receive allowed blocks', function() {
            var build = new (redactor.getBuild('post'))();

            build.push(new TextBlock({}));
            expect(build.blocks.__blocks.length).to.be(1);
        });
        it('should not receive disallowed blocks', function(done) {
            var build = new (redactor.getBuild('post'))();

            try {
                build.push(new ImageBlock({}));
            } catch (e) {
                done();
            }
        });
    });
});