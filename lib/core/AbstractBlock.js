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
        var that = this,
            _render,
            _getTemplate,
            _getBaseTemplate;

        _render = function(baseTemplate, template){
            template.render(that.model.toJSON(), function(innerHtml){
                baseTemplate.render({innerHtml: innerHtml}, function(html){
                    callback($(html));
                });
            })
        };

        _getTemplate = function(baseTemplate){
            var blockTemplate = templates.getBlockTemplate(that.getType());

            if (!blockTemplate) {
                that.getTemplate(function(template){
                    var blockTemplate = new (templates.getEngine())(template);

                    templates.setBlockTemplate(that.getType(), blockTemplate)
                    _render(baseTemplate, blockTemplate);
                });
            } else {
                _render(baseTemplate, blockTemplate);
            }
        };

        _getBaseTemplate = function(){
            var baseTemplate = templates.getBaseBlockTemplate();

            if (!baseTemplate) {
                that.getBaseTemplate(function(template){
                    baseTemplate = new (templates.getEngine())(template);
                    templates.setBaseBlockTemplate(baseTemplate);
                    _getTemplate(baseTemplate);
                });
            } else {
                _getTemplate(baseTemplate);
            }
        };

        _getBaseTemplate();
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

    /**
     * Получение базового шаблона для всех блоков
     * @param callback  Артумент: строка шаблона
     */
    AbstractBlock.prototype.getBaseTemplate = function(callback){
        require(['redactor/vendors/text!' + config.getOption('baseBlockTemplateSource')], function(template){
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