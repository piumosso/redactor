define('redactor/modules/adder', [
    'redactor/config',
    'redactor/core/blockGetter',
    'redactor/core/Build'
], function(config, getBlock, Build){
    return function(){
        Build.prototype.initializeAdder = function(){
            this.renderContext.allowedBlocks = config.getOption('buildTypes')[this.getType()].blocks;
            this.once('render', _.bind(function(){
                this.$el.on('click', '.js-adder-item', _.bind(this.onAdd, this));
            }, this));
        };

        Build.prototype.onAdd = function(e){
            var block = getBlock({
                type: $(e.target).data('type'),
                el: $('.js-blocks', this.$el)
            });

            this.add(block);
        };
    };
});
