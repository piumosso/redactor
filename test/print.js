var Redactor = require('../build/redactor');
var expect = require('expect.js');
var sinon = require('sinon');
var _ = require('underscore');


describe('Printing.', function () {
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

    class SpyRedactor extends Redactor {
        getTemplateEngine() {
            return SpyTemplate;
        }
    }

    var spyRedactor = new SpyRedactor();
    var SpyBaseBlock = spyRedactor.getBaseBlock();
    var SpyBaseBuild = spyRedactor.getBaseBuild();

    class SpyTextBlock extends SpyBaseBlock {
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

    class SpyPostBuild extends SpyBaseBuild {
        get type() {
            return 'post';
        }

        get printTemplateString() {
            return 'TEMPLATE TEXT';
        }

        get printTemplateStringRss() {
            return 'TEMPLATE TEXT FOR RSS';
        }
    }

    spyRedactor.addBlock(SpyTextBlock);
    spyRedactor.addBuild(SpyPostBuild);

    describe('Block.print', function () {
        var textBlock = new (spyRedactor.getBlock('text'))({
            content: 'CONTENT'
        });

        it('should use default template', function (done) {
            textBlock.print().then(function () {
                var lastConstructorSpyCallArg = constructorSpy.args[constructorSpy.args.length - 1][0];
                expect(lastConstructorSpyCallArg).to.be('TEMPLATE TEXT');
                done();
            }).fail(done);
        });
        it('should use contextual template', function (done) {
            textBlock.print('rss').then(function () {
                var lastConstructorSpyCallArg = constructorSpy.args[constructorSpy.args.length - 1][0];
                expect(lastConstructorSpyCallArg).to.be('TEMPLATE TEXT FOR RSS');
                done();
            }).fail(done);
        });
        it('should use default template if contextual template have missed', function (done) {
            textBlock.print('teaser').then(function () {
                var lastConstructorSpyCallArg = constructorSpy.args[constructorSpy.args.length - 1][0];
                expect(lastConstructorSpyCallArg).to.be('TEMPLATE TEXT');
                done();
            }).fail(done);
        });
        it('should build context for template engine from the model', function (done) {
            textBlock.print().then(function () {
                var lastRenderSpyCallArg = renderSpy.args[renderSpy.args.length - 1][0];
                expect(lastRenderSpyCallArg).to.eql({
                    content: 'CONTENT'
                });
                done();
            }).fail(done);
        });
        it('should build context for template engine from the model and global context', function (done) {
            textBlock.print(null, {globalVar: 100500}).then(function () {
                var lastRenderSpyCallArg = renderSpy.args[renderSpy.args.length - 1][0];
                expect(lastRenderSpyCallArg).to.eql({
                    globalVar: 100500,
                    content: 'CONTENT'
                });
                done();
            }).fail(done);
        });
    });

    var redactor = new Redactor();
    var SimpleBaseBlock = redactor.getBaseBlock();

    class SimpleTextBlock extends SimpleBaseBlock {
        get type() {
            return 'text';
        }

        get printTemplateString() {
            return 'p= content';
        }

        get printTemplateStringRss() {
            return '=content\nbr';
        }
    }

    redactor.addBlock(SimpleTextBlock);

    describe('BlockCollection.print', function () {
        var collection = new (redactor.getBlockCollection())();

        collection.push(new (redactor.getBlock('text'))({
            content: '123',
            status: 'ACTIVE'
        }));
        collection.push(new (redactor.getBlock('text'))({
            content: '456',
            status: 'INACTIVE'
        }));
        collection.push(new (redactor.getBlock('text'))({
            content: '789',
            status: 'ACTIVE'
        }));

        it('should print only active blocks', function (done) {
            collection.print().then(function (html) {
                expect(html).to.be('<p>123</p>\n<p>789</p>');
                done();
            }).fail(done);
        });
        it('should provide printing-context to its blocks', function (done) {
            collection.print('rss').then(function (html) {
                expect(html).to.be('123<br/>\n789<br/>');
                done();
            }).fail(done);
        });
        it('should filter block with filter-function', function (done) {
            function filter(blocks) {
                return _.filter(blocks, block => block.model.content != '789');
            }

            collection.print(null, filter).then(function (html) {
                expect(html).to.be('<p>123</p>');
                done();
            }).fail(done);
        });
    });

    describe('Build.print', function () {
        var postBuild = new (spyRedactor.getBuild('post'))({
            title: 'TITLE'
        });

        it('should use default template', function (done) {
            postBuild.print().then(function () {
                var lastConstructorSpyCallArg = constructorSpy.args[constructorSpy.args.length - 1][0];
                expect(lastConstructorSpyCallArg).to.be('TEMPLATE TEXT');
                done();
            }).fail(done);
        });
        it('should use contextual template', function (done) {
            postBuild.print('rss').then(function () {
                var lastConstructorSpyCallArg = constructorSpy.args[constructorSpy.args.length - 1][0];
                expect(lastConstructorSpyCallArg).to.be('TEMPLATE TEXT FOR RSS');
                done();
            }).fail(done);
        });
        it('should use default template if contextual template have missed', function (done) {
            postBuild.print('teaser').then(function () {
                var lastConstructorSpyCallArg = constructorSpy.args[constructorSpy.args.length - 1][0];
                expect(lastConstructorSpyCallArg).to.be('TEMPLATE TEXT');
                done();
            }).fail(done);
        });
        it('should build context for template engine from its form', function (done) {
            postBuild.print().then(function () {
                var lastRenderSpyCallArg = renderSpy.args[renderSpy.args.length - 1][0];
                expect(lastRenderSpyCallArg).to.eql({
                    type: 'post',
                    form: {
                        title: 'TITLE'
                    },
                    context: undefined,
                    blocksHtml: ''
                });
                done();
            }).fail(done);
        });
        it('should build context for template engine from its form and global context', function (done) {
            postBuild.print('rss', null, {globalVar: 100500}).then(function () {
                var lastRenderSpyCallArg = renderSpy.args[renderSpy.args.length - 1][0];
                expect(lastRenderSpyCallArg).to.eql({
                    globalVar: 100500,
                    type: 'post',
                    form: {
                        title: 'TITLE'
                    },
                    context: 'rss',
                    blocksHtml: ''
                });
                done();
            }).fail(done);
        });
    });
});
