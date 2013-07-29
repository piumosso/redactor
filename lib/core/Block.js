define('redactor/core/Block', [
    'redactor/core/BlockModel'
], function(BlockModel){
    var AbstractBlock = function(data){
        this.model = new this.Model(data);
    };

    AbstractBlock.prototype.getType = function(){
        return this.model.get('type');
    };

    AbstractBlock.prototype.toString = function(){
        return this.model.toString();
    };

    AbstractBlock.extend = function(ModelExtension){
        var Block = function(){
            AbstractBlock.apply(this, arguments);
        };

        Block.prototype = AbstractBlock.prototype;
        Block.prototype.Model = BlockModel.extend(ModelExtension).extend({
            defaults: _.extend({}, BlockModel.prototype.defaults, ModelExtension.defaults || {})
        });

        return Block;
    };

    return AbstractBlock;
});
