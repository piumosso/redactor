define('redactor/core/BlockCollection', function(){
    var BlockCollection = function(){};

    BlockCollection.prototype = new Array;

    BlockCollection.prototype.add = function(block, position){
        if (_.isNumber(position)) {
            this.splice(position, 0, block);
        } else {
            this.push(block);
        }
    };

    return BlockCollection;
});
