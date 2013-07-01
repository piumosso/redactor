define('redactor/modules/Build', [
    'redactor/modules/BlockCollection'
], function(BlockCollection){
    var Build = function(){
        this.blocks = new BlockCollection();
    };

    Build.prototype.reset = function(data){};
    Build.prototype.render = function(){};

    return Build;
});
