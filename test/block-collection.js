var Redactor = require('../../dist/lib/Redactor');
var expect = require('expect.js');


describe('BlockCollection', function() {
    class TextBlock extends Redactor.BaseBlock {
        type() {
            return 'text';
        }
    }

    describe('.push', function() {
        it('should receive block', function() {
            var collection = new Redactor.BlockCollection();
            var firstBlock = new TextBlock();

            collection.push(firstBlock);
            expect(collection.__blocks.length).to.be.equal(1);
            expect(firstBlock.model.weight).to.be.equal(0);
        });
        it('should receive several blocks and add them at the end', function() {
            var collection = new Redactor.BlockCollection();
            var firstBlock = new TextBlock();
            var secondBlock = new TextBlock();

            collection.push(firstBlock);
            collection.push(secondBlock);
            expect(collection.__blocks.length).to.be.equal(2);
            expect(firstBlock.model.weight).to.be.equal(0);
            expect(secondBlock.model.weight).to.be.equal(1);
        });
        it('should receive block and add by index', function() {
            var collection = new Redactor.BlockCollection();
            var firstBlock = new TextBlock();
            var secondBlock = new TextBlock();

            collection.push(firstBlock);
            collection.push(secondBlock, 0);
            expect(firstBlock.model.weight).to.be.equal(1);
            expect(secondBlock.model.weight).to.be.equal(0);
        });
    });

    describe('.reset', function() {
        it('should reset block collection', function() {
            var collection = new Redactor.BlockCollection();
            var firstBlock = new TextBlock();
            var secondBlock = new TextBlock();
            var thirdBlock = new TextBlock();

            collection.push(firstBlock);
            collection.reset([secondBlock, thirdBlock]);
            expect(collection.__blocks.length).to.be(2);
            expect(collection.__blocks[0]).to.be(secondBlock);
            expect(collection.__blocks[1]).to.be(thirdBlock);
        })
    });
});