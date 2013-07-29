define('redactor/blocks/text', [
    'redactor/core/Block'
], function(Block){
    return Block.extend({
        defaults: {
            content: ''
        },

        toString: function(){
            var content = this.get('content');

            if (content.length > 20) {
                return '"' + content.slice(0, 18) + '…"';
            } else {
                return '"' + content + '"';
            }
        }
    });
});
