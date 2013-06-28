define('redactor/modules/BlockCollection', [
    'redactor/modules/Block'
], function(Block){
    var BlockCollection = Backbone.Collection.extend({
        model: Block
    });

    return BlockCollection;
});
