var Q = require('q');


function BlockCollection(){}


// BlockCollection по сути массив
BlockCollection.prototype = new Array;


/**
 * Добавление блока в коллекцию
 * @param block     Объект блока
 * @param position  Позиция вставки. Если неопределено, вставляем в конец
 */
BlockCollection.prototype.add = function(block, position){
    if (_.isNumber(position)) {
        this.splice(position, 0, block);
    } else {
        this.push(block);
    }
    this.updateWeights();
};


BlockCollection.prototype.updateWeights = function(){
    _.each(this, function(block, index){
        block.model.set('weight', index);
    });
};


/**
 * Получение отсортированной коллекции
 * @returns {*}
 */
BlockCollection.prototype.getSorted = function(){
    return _.sortBy(this, function(block){
        return block.model.get('weight');
    });
};


/**
 * Пучать Коллекции блоков
 * @param context
 * @param filter    Фильтрация блоков
 * @returns {$.Deferred}
 */
BlockCollection.prototype.print = function(context, filter){
    var blocks,
        blockDs;

    blocks = this.getSorted();
    if (_.isFunction(filter)) {
        blocks = filter(blocks);
    }

    blockDs = _.map(blocks, function(block){
        if (block.isActive()) {
            return block.print(context, filter);
        }
    });

    return Q.all(blockDs).then(function(blocks){
        return blocks.join('\n');
    });
};


module.exports = BlockCollection;
