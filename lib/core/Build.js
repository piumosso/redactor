var config = require('../config'),
    BlockCollection = require('./BlockCollection'),
    getBlock = require('./blockGetter'),
    templates = require('../templates/templates'),
    initializeMixin = require('./initialize');


/**
 * Проверка типа билда
 * @param type  Тип
 */
function checkBuildType(type){
    if (!type) {
        throw new Error('Тип билда не определён');
    }
    if (!_.has(config.getOption('buildTypes'), type)) {
        throw new Error('Тип билда ' + type + ' не опознан');
    }

    return type;
};


/**
 * Сборка редактора
 *
 * @param options   Объект структуры {type[, blocks]}
 * @constructor
 */
function Build(options){
    var that = this;

    // Основные атрибуты сборки
    this.type = checkBuildType(options.type);
    this.blockCollection = new BlockCollection();

    // Инициализация атрибутов
    if (!_.isEmpty(options.blocks)) {
        this.reset(options.blocks);
    }

    if (options.el) {
        this.render(function($el){
            $el.appendTo(options.el);

            if (that.blockCollection.length) {
                _.each(that.blockCollection, function(block){
                    block.render(function($el){
                        $('.js-blocks', that.el).append($el);
                        block.trigger('block.dom.insert');
                    });
                });
            }
        });
    }

    this.initialize();
};


_.extend(Build.prototype, Backbone.Events);
_.extend(Build.prototype, initializeMixin);


/**
 * Получение типа сборки
 */
Build.prototype.getType = function(){
    return this.type;
};


/**
 * Заполнение сборки блоками
 * @param data  Данные для построения блоков
 */
Build.prototype.reset = function(data){
    _.each(data, _.bind(function(dataItem){
        this.add(getBlock(dataItem));
    }, this));
};


/**
 * Добавление в сборку блока в конец или на заданную позицию
 * @param block     Блок
 * @param position  Позиция вставки; если пустая, то в конец
 */
Build.prototype.add = function(block, position){
    if (this.canReceive(block.getType())) {
        this.blockCollection.add(block, position);
        block.build = this;
    } else {
        console.warn('Сборка ' + this.getType() + ' не принимает блоки ' + block.getType());
    }
};


/**
 * Проерка, может ли билд принимать блоки определённого типа
 * @param blockType Тип принимаемого блока
 */
Build.prototype.canReceive = function(blockType){
    var buildTypeConfig = config.getOption('buildTypes')[this.getType()];

    // TODO вынести провеку в config.config()
    if (_.isUndefined(buildTypeConfig.blocks)) {
        throw new Error('Тип билда ' + this.getType() + ' неправильно сконфигурирован: отсутствует описание блоков');
    }

    return _.indexOf(buildTypeConfig.blocks, blockType) != -1;
};


/**
 * Отрисовка сборки
 * @param callback  Артумент: jQuery-объект
 */
Build.prototype.render = function(callback){
    var that = this,
        _render;

    _render = function(template){
        template.render({}, function(html){
            that.$el = $(html);
            that.el = that.$el[0];
            that.trigger('build.render');

            callback(that.$el);
        })
    };

    if (!templates.getBuildTemplate()) {
        this.getTemplate(function(template){
            var buildTemplate = new (templates.getEngine())(template);

            templates.setBuildTemplate(buildTemplate);
            _render(buildTemplate);
        });
    } else {
        _render(templates.getBuildTemplate());
    }
};


/**
 * Получение шаблона сборки
 * @param callback  Артумент: строка шаблона
 */
Build.prototype.getTemplate = function(callback){
    var buildTypeConfig = config.getOption('buildTypes')[this.getType()];

    this._templateGetter(
        buildTypeConfig.template,
        buildTypeConfig.templateSource,
        config.getOption('defaultBuildTemplate'),
        config.getOption('defaultBuildTemplateSource')
    ).then(callback);
};


/**
 * Получение шаблона для печати
 * @param context   Строковый идентификатор контекста печати
 */
Build.prototype.getPrintTemplate = function(context){
    var buildTypeConfig = config.getOption('buildTypes')[this.getType()];

    return this._templateGetter(
        buildTypeConfig.printTemplate,
        buildTypeConfig.printTemplateSource,
        config.getOption('defaultBuildPrintTemplate'),
        config.getOption('defaultBuildPrintTemplateSource')
    );
};


/**
 * Получение шаблона
 * @param template              Шаблон
 * @param templateSource        Источник шаблона
 * @param defaultTemplate       Шаблон по умолчанию
 * @param defaultTemplateSource Источник шаблона по умолчанию
 * @private
 */
Build.prototype._templateGetter = function(template, templateSource, defaultTemplate, defaultTemplateSource){
    var df = new $.Deferred();

    if (template) {
        df.resolve(template);
    } else if (templateSource) {
        require(['text!' + templateSource], function(template){
            df.resolve(template);
        });
    } else if (defaultTemplate) {
        df.resolve(defaultTemplate);
    } else if (defaultTemplateSource) {
        require(['text!' + defaultTemplateSource], function(template){
            df.resolve(template);
        });
    } else {
        throw new Error('Шаблон сборки не определён');
    }

    return df;
};


/**
 * Печать сборки
 * @param callback  Функция, получающая первым аргументом html результата
 * @param context   Строковый идентификатор контекста печати
 */
Build.prototype.print = function(callback, context){
    var that = this;

    this.getPrintTemplate(context).then(function(printTemplateHtml){
        var printTemplate = new (templates.getEngine())(printTemplateHtml);

        that.blockCollection.print(context).then(function(blocksHtml){
            printTemplate.render({
                blocksHtml: blocksHtml
            }, callback);
        });
    });
};


module.exports = Build;
