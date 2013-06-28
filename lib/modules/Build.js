define('redactor/modules/Build', [
    'redactor/modules/BlockCollection'
], function(BlockCollection){
    var Build = function(options){
        this.blocks = new BlockCollection(options.blocks || [])
    };

    return Build;
});
