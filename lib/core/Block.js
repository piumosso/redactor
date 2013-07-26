define('redactor/core/Block', [
    'redactor/core/BlockModel'
], function(BlockModel){
    var AbstractBlock = function(data){
        this.model = new this.Model(data);
    };


    AbstractBlock.extend = function(ModelExtension){
        var Block = function(){};

        Block.prototype = new AbstractBlock;
        Block.prototype.Model = BlockModel.extend(ModelExtension).extend({
            defaults: _.extend({}, BlockModel.defaults, ModelExtension.defaults || {})
        });

        return Block;
    };


    return AbstractBlock;
});
