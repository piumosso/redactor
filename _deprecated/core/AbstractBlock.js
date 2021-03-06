var config = require('../config'),
    Build = require('./Build'),
    BlockModel = require('./BlockModel'),
    templates = require('./templates'),
    initializeMixin = require('./initialize'),
    _ = require('underscore'),
    Q = require('q'),
    Backbone = require('backbone'),
    fs = require('fs');


function AbstractBlock(data){
    var modelData;

    modelData = _.omit(data, 'build');
    this.model = new this.Model(modelData);
    this.model.view = this;

    if (this.hasBuild && data.build) {
        this.innerBuild = new Build(data.build);
    }

    if (data.el) {
        this.render(_.bind(function($el){
            var weight;

            weight = this.model.get('weight');
            if (weight) {
                $el.insertAfter($(data.el).find('> *').eq(weight - 1));
            } else {
                $el.appendTo(data.el);
            }

            this.trigger('block.dom.insert');
        }, this));
    }

    this.initialize();
    this.editable();
};


_.extend(AbstractBlock.prototype, Backbone.Events);
_.extend(AbstractBlock.prototype, initializeMixin);


AbstractBlock.prototype.hasBuild = false;


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
                if (that.el) {
                    that.$el = $(html);
                    $(that.el).replaceWith(that.$el);
                    that.el = that.$el[0];
                    that.trigger('block.dom.insert');
                } else {
                    that.$el = $(html);
                    that.el = that.$el[0];
                }
                that.trigger('block.render');

                if (_.isFunction(callback)) {
                    callback(that.$el);
                }
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
    require(['text!' + 'redactor/blocks/' + this.getType() + '.html'], function(template){
        callback(template);
    });
};


/**
 * Получение базового шаблона для всех блоков
 * @param callback  Артумент: строка шаблона
 */
AbstractBlock.prototype.getBaseTemplate = function(callback){
    require(['text!' + config.getOption('baseBlockTemplateSource')], function(template){
        callback(template);
    });
};


/**
 * Получение шаблона печати
 */
AbstractBlock.prototype.getPrintTemplate = function(context){
    var d = Q.defer(),
        printTemplateDir,
        fullTemplateFileName,
        template;

    printTemplateDir =
        config.getOption('blocks')[this.getType()].printTemplateDir ||
        config.getOption('baseBlocksPrintTemplateDir');
    fullTemplateFileName = _.compact([this.getType(), 'print', context, 'jade']).join('.');
    template = fs.readFileSync(printTemplateDir + fullTemplateFileName);
    d.resolve(template);

    return d.promise;
};


/**
 * Инициализация редактирования текстовых полей
 */
AbstractBlock.prototype.editable = function(){
    var that = this;

    this.on('block.dom.insert', function(){
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
 * @param filter    Фильтрация блоков
 * @param globalContext    Глобальный контекст
 */
AbstractBlock.prototype.print = function(context, filter, globalContext){
    var that = this,
        basicContext,
        contextD;

    basicContext = that.model.toJSON();
    basicContext.buildType = this.build.getType();
    basicContext.buildForm = this.build.getForm();

    if (this.hasBuild) {
        contextD = this.innerBuild.print(context, filter, globalContext).then(function(innerBuildHtml){
            return Q(
                _.extend(
                    basicContext, {
                        innerBuildHtml: innerBuildHtml
                    }
                )
            );
        });
    } else {
        contextD = Q(basicContext);
    }

    return Q.all([this.getPrintTemplate(context), contextD]).then(function(data){
        var printTemplateHtml,
            context,
            printTemplate;

        printTemplateHtml = data[0];
        context = data[1];
        printTemplate = new (templates.getEngine())(printTemplateHtml);
        _.extend(context, globalContext || {});

        return printTemplate.render(context);
    });
};


/**
 * Фокус на элементе (вызывается при вставке)
 */
AbstractBlock.prototype.focus = function(){
    $('.js-redactor-editable:first', this.el).focus()
};


/**
 * Получение сборки, к котороей принадлежит блок
 * @returns {*}
 */
AbstractBlock.prototype.getBuild = function(){
    return this.build;
};


/**
 * Вставка в сборку блока после целевого
 * @param targetBlock   Целевой блок
 * @param block         Блок для вставки
 */
AbstractBlock.prototype.insertAfter = function(targetBlock){
    var position,
        build;

    build = targetBlock.getBuild();
    position = _.indexOf(build.blockCollection, targetBlock) + 1;
    this.model.set({weight: position});
    build.add(this, position);
};


AbstractBlock.extend = function(ModelExtension, blockExtensions){
    var Block = function(){
        AbstractBlock.apply(this, arguments);
    };

    Block.prototype = _.extend({}, AbstractBlock.prototype, blockExtensions || {});
    Block.prototype.Model = BlockModel.extend(ModelExtension).extend({
        defaults: _.extend({}, BlockModel.prototype.defaults, ModelExtension.defaults || {})
    });

    return Block;
};


module.exports = AbstractBlock;
