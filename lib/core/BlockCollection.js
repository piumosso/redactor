define('redactor/core/BlockCollection', function(){
    var BlockCollection = function(){};

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
     * @returns {$.Deferred}
     */
    BlockCollection.prototype.print = function(context){
        var df = new $.Deferred(),
            blockDfs = [];

        _.each(this.getSorted(), function(block){
            if (block.isActive()) {
                blockDfs.push(block.print(context));
            }
        });
        $.when.apply({}, blockDfs).then(function(){
            df.resolve(Array.prototype.slice.call(arguments).join('\n'));
        });

        return df;
    };

    return BlockCollection;
});
