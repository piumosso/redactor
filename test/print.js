var Redactor = require('../../dist/lib/Redactor');
var expect = require('expect.js');
var sinon = require('sinon');


describe('Printing.', function() {
    var constructorSpy = sinon.spy();
    var renderSpy = sinon.spy();

    class SpyTemplate {
        constructor() {
            constructorSpy.apply(this, arguments);
        }

        render() {
            return renderSpy.apply(this, arguments);
        }
    }

    class TestRedactor extends Redactor {
        getTemplateEngine() {
            return SpyTemplate;
        }
    }

    var testRedactor = new TestRedactor();
    var BaseBlock = testRedactor.getBaseBlock();

    class TextBlock extends BaseBlock {
        get type() {
            return 'text';
        }

        get printTemplateString() {
            return 'TEMPLATE TEXT';
        }

        get printTemplateStringRss() {
            return 'TEMPLATE TEXT FOR RSS';
        }
    }

    testRedactor.addBlock(TextBlock);

    describe('Block.print', function() {
        var textBlock = new (testRedactor.getBlock('text'))({
            content: 'CONTENT'
        });

        it('should use default template', function(done) {
            textBlock.print().then(function() {
                expect(constructorSpy.args[constructorSpy.args.length -1][0]).to.be('TEMPLATE TEXT');
                done();
            }).fail(done);
        });
        it('should use contextual template', function(done) {
            textBlock.print('rss').then(function() {
                expect(constructorSpy.args[constructorSpy.args.length -1][0]).to.be('TEMPLATE TEXT FOR RSS');
                done();
            }).fail(done);
        });
        it('should use default template if contextual template have missed', function(done) {
            textBlock.print('teaser').then(function() {
                expect(constructorSpy.args[constructorSpy.args.length -1][0]).to.be('TEMPLATE TEXT');
                done();
            }).fail(done);
        });
        it('should build correct context for template engine');
    });
});
