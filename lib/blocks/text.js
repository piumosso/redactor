define('redactor/blocks/text', [
    'redactor/core/AbstractBlock'
], function(AbstractBlock){
    return AbstractBlock.extend({
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
