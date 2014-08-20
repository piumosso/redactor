var Redactor = require('../../dist/lib/Redactor');
var expect = require('expect.js');


describe('Redactor', function() {
    var redactor = new Redactor();

    describe('.block', function() {
        class TextBlock extends Redactor.BaseBlock {
            type() {
                return 'text';
            }
        }

        redactor.block(TextBlock);

        it('should receive blocks', function() {
            var redactorTextInstance = new redactor.__blocks.text({});
            var textInstance = new TextBlock({});

            expect(redactorTextInstance.__proto__.__proto__).to.be(textInstance.__proto__);
        });
        it('should bind block class and redactor instance', function() {
            var block = new redactor.__blocks.text({});

            expect(block.redactor()).to.be(redactor);
        });
    });
    describe('.build', function() {
        class PostBuild extends Redactor.BaseBuild {
            type() {
                return 'post';
            }
        }

        redactor.build(PostBuild);

        it('should receive builds', function() {
            var redactorPostInstance = new redactor.__builds.post({});
            var postInstance = new PostBuild({});

            expect(redactorPostInstance.__proto__.__proto__).to.be(postInstance.__proto__);
        });
        it('should bind block class and redactor instance', function() {
            var build = new redactor.__builds.post({});

            expect(build.redactor() ).to.be(redactor);
        });
    });
});