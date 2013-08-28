define('redactor/core/Build', [
    'redactor/config',
    'redactor/core/BlockCollection',
    'redactor/core/blockGetter',
    'redactor/templates/templates'
], function(config, BlockCollection, getBlock, templates){

    /**
     * Проверка типа билда
     * @param type  Тип
     */
    var checkBuildType = function(type){
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
    var Build = function(options){
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
                that.el = options.el;
                $el.appendTo(options.el);

                if (that.blockCollection.length) {
                    _.each(that.blockCollection, function(block){
                        block.render(function($el){
                            $('.js-blocks', that.el).append($el);
                        });
                    });
                }
            });
        }
    };

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
        var render = _.bind(function(template){
                template.render({}, function(html){
                    callback($(html));
                })
            }, this);

        if (!templates.getBuildTemplate()) {
            this.getTemplate(_.bind(function(template){
                var buildTemplate = new (templates.getEngine())(template);

                templates.setBuildTemplate(buildTemplate);
                render(buildTemplate);
            }, this));
        } else {
            render(templates.getBuildTemplate());
        }
    };

    /**
     * Получение шаблона сборки
     * @param callback  Артумент: строка шаблона
     */
    Build.prototype.getTemplate = function(callback){
        var buildTypeConfig = config.getOption('buildTypes')[this.getType()],
            defaultBuildTemplate = config.getOption('defaultBuildTemplate'),
            defaultBuildTemplateSource = config.getOption('defaultBuildTemplateSource');

        if (buildTypeConfig.template) {
            callback(buildTypeConfig.template);
        } else if (buildTypeConfig.templateSource) {
            require(['redactor/vendors/text!' + buildTypeConfig.templateSource], function(template){
                callback(template);
            });
        } else if (defaultBuildTemplate) {
            callback(defaultBuildTemplate);
        } else if (defaultBuildTemplateSource) {
            require(['redactor/vendors/text!' + defaultBuildTemplateSource], function(template){
                callback(template);
            });
        } else {
            throw new Error('Шаблон сборки не определён');
        }
    };

    return Build;
});
