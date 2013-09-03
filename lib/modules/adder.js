define('redactor/modules/adder', [
    'redactor/config',
    'redactor/core/blockGetter',
    'redactor/core/Build',
    'redactor/templates/templates',
    'redactor/vendors/text!redactor/templates/adder.html'
], function(config, getBlock, Build, templates, adderHtml){
    var adderTemplate;

    return function(){
        Build.prototype.initializeAdder = function(){
            var that = this;

            adderTemplate = new (templates.getEngine())(adderHtml);
            this.once('render', function(){
                that.renderAdder();
                that.$el.on('click', '.js-adder-item', _.bind(that.onAdd, this));
            });
        };

        Build.prototype.renderAdder = function(){
            var that = this,
                context = {
                    allowedBlocks: config.getOption('buildTypes')[that.getType()].blocks
                };

            adderTemplate.render(context, function(html){
                that.$el.find('.js-blocks').after(html);
            });
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
