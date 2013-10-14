define('redactor/core/AbstractBlock', [
    'redactor/config',
    'redactor/core/BlockModel',
    'redactor/templates/templates',
    'redactor/core/initialize'
], function(config, BlockModel, templates, initializeMixin){
    var AbstractBlock = function(data){
        this.model = new this.Model(data);
        this.model.view = this;

        if (data.el) {
            this.render(_.bind(function($el){
                $el.appendTo(data.el);
                this.trigger('dom-insert');
            }, this));
        }

        this.initialize();
        this.editable();
    };

    _.extend(AbstractBlock.prototype, Backbone.Events);
    _.extend(AbstractBlock.prototype, initializeMixin);

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
            var context = that.model.toJSON();

            template.render(context, function(innerHtml){
                baseTemplate.render({innerHtml: innerHtml}, function(html){
                    that.$el = $(html);
                    that.el = that.$el[0];
                    that.trigger('render');
                    
                    callback(that.$el);
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

    /**
     * Получение шаблона печати
     */
    AbstractBlock.prototype.getPrintTemplate = function(context){
        var df = new $.Deferred();

        require(['redactor/vendors/text!' + 'redactor/blocks/' + this.getType() + '.print.html'], function(template){
            df.resolve(template);
        });

        return df;
    };

    /**
     * Инициализация редактирования текстовых полей
     */
    AbstractBlock.prototype.editable = function(){
        var that = this;

        this.once('render', function(){
            require([config.getOption('editable')], function(Editable){
                $('.js-redactor-editable', that.el).each(function(){
                    new Editable($(this), that.model);
                });
            });
        });
    };

    /**
     * Активен ли блок
     * @returns {boolean}
     */
    AbstractBlock.prototype.isActive = function(){
        return this.model.get('status') == 'ACTIVE';
    };


    /**
     * Печать блока
     * @param context   Строковый идентификатор контекста печати
     */
    AbstractBlock.prototype.print = function(context){
        var df = new $.Deferred(),
            that = this;

        this.getPrintTemplate(context).then(function(printTemplateHtml){
            var printTemplate = new (templates.getEngine())(printTemplateHtml),
                context = that.model.toJSON();

            printTemplate.render(context, function(html){
                df.resolve(html);
            });
        });

        return df;
    };

    /**
     * Фокус на элементе (вызывается при вставке)
     */
    AbstractBlock.prototype.focus = function(){
        $('.js-redactor-editable:first', this.el).focus()
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
