define('redactor/core/Block', function(){
    var BlockModel = Backbone.Model.extend({
        defaults: {
            type: null,
            weight: 0
        }
    });

    var Block = function(){
        this.initialize(arguments);
    };

    Block.prototype.initialize = function(data){
        this.model = new BlockModel(data);
    };

    Block.prototype.getType = function(){
        return this.model.get('type');
    };

    return Block;
});
