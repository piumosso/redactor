define('redactor/core/AbstractBlock', [
    'redactor/config',
    'redactor/core/BlockModel',
    'redactor/templates/templates'
], function(config, BlockModel, templates){
    var AbstractBlock = function(data){
        this.model = new this.Model(data);

        if (data.el) {
            this.render(function($el){
                $el.appendTo(options.el);
            });
        }
    };

    AbstractBlock.prototype.getType = function(){
        return this.model.get('type');
    };

    AbstractBlock.prototype.toString = function(){
        return this.model.toString();
    };

    /**
     * Отрисовка блока
     * @param callback  Артумент: jQuery-объект
     */
    AbstractBlock.prototype.render = function(callback){
        var render = _.bind(function(template){
                template.render(this.model.toJSON(), function(html){
                    callback($(html));
                })
            }, this);

        if (!templates.getBlockTemplate(this.getType())) {
            this.getTemplate(_.bind(function(template){
                var blockTemplate = new (templates.getEngine())(template);

                templates.setBlockTemplate(this.getType(), blockTemplate)
                render(blockTemplate);
            }, this));
        } else {
            render();
        }
    };

    /**
     * Получение шаблона блока
     * @param callback  Артумент: строка шаблона
     */
    AbstractBlock.prototype.getTemplate = function(callback){
        require(['redactor/vendors/text!' + 'redactor/blocks/' + this.getType() + '.html'], function(template){
            callback(template);
        });
    };

    AbstractBlock.extend = function(ModelExtension){
        var Block = function(){
            AbstractBlock.apply(this, arguments);
        };

        Block.prototype = AbstractBlock.prototype;
        Block.prototype.Model = BlockModel.extend(ModelExtension).extend({
            defaults: _.extend({}, BlockModel.prototype.defaults, ModelExtension.defaults || {})
        });

        return Block;
    };

    return AbstractBlock;
});
