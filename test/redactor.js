var Redactor = require('../build/redactor');
var expect = require('expect.js');


describe('Redactor', function() {
    var redactor = new Redactor();
    var BaseBlock = redactor.getBaseBlock();
    var BaseBuild = redactor.getBaseBuild();

    describe('.addBlock', function() {
        class TextBlock extends BaseBlock {
            get type() {
                return 'text';
            }
        }

        redactor.addBlock(TextBlock);

        it('should receive blocks', function() {
            var redactorTextInstance = new (redactor.getBlock('text'))({});
            var textInstance = new TextBlock({});

            expect(redactorTextInstance.__proto__.__proto__).to.be(textInstance.__proto__);
        });
        it('should bind block class and redactor instance', function() {
            var block = new (redactor.getBlock('text'))({});

            expect(block.redactor).to.be(redactor);
        });
    });
    describe('.addBuild', function() {
        class PostBuild extends BaseBuild {
            get type() {
                return 'post';
            }
        }

        redactor.addBuild(PostBuild);

        it('should receive builds', function() {
            var redactorPostInstance = new (redactor.getBuild('post'))({});
            var postInstance = new PostBuild({});

            expect(redactorPostInstance.__proto__.__proto__).to.be(postInstance.__proto__);
        });
        it('should bind block class and redactor instance', function() {
            var build = new (redactor.getBuild('post'))({});

            expect(build.redactor).to.be(redactor);
        });
    });
});