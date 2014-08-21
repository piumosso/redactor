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
              var lastConstructorSpyCallArg = constructorSpy.args[constructorSpy.args.length - 1][0];
              expect(lastConstructorSpyCallArg).to.be('TEMPLATE TEXT');
                done();
            }).fail(done);
        });
        it('should use contextual template', function(done) {
            textBlock.print('rss').then(function() {
              var lastConstructorSpyCallArg = constructorSpy.args[constructorSpy.args.length - 1][0];
              expect(lastConstructorSpyCallArg).to.be('TEMPLATE TEXT FOR RSS');
                done();
            }).fail(done);
        });
        it('should use default template if contextual template have missed', function(done) {
            textBlock.print('teaser').then(function() {
              var lastConstructorSpyCallArg = constructorSpy.args[constructorSpy.args.length - 1][0];
              expect(lastConstructorSpyCallArg).to.be('TEMPLATE TEXT');
                done();
            }).fail(done);
        });
        it('should build context for template engine from the model', function (done) {
          textBlock.print().then(function() {
            var lastRenderSpyCallArg = renderSpy.args[renderSpy.args.length - 1][0];
            expect(lastRenderSpyCallArg).to.eql({
              content: 'CONTENT'
            });
            done();
          }).fail(done);
        });
      it('should build context for template engine from the model and global context', function (done) {
        textBlock.print(null, {globalVar: 100500}).then(function() {
          var lastRenderSpyCallArg = renderSpy.args[renderSpy.args.length - 1][0];
          expect(lastRenderSpyCallArg).to.eql({
            globalVar: 100500,
            content: 'CONTENT'
          });
          done();
        }).fail(done);
      });
    });
});
