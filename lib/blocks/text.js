define('redactor/blocks/text', [
    'redactor/core/Block'
], function(Block){
    return Block.extend({
        defaults: {
            content: ''
        }
    });
});
