define('redactor/core/BlockCollection', [
    'redactor/core/Block'
], function(Block){
    return Backbone.Collection.extend({
        model: Block
    });
});
