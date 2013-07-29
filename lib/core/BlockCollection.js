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
    };

    return BlockCollection;
});
