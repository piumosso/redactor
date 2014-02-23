var configurationApi = require('./config'),
    DefaultSynchronizer = require('./synchronizers/Default'),
    Build = require('./core/Build'),
    templates = require('./templates/templates'),
    _ = require('underscore'),
    Q = require('q');


var Redactor = {},
    redactorInitialized = false;


// Публичное API
_.extend(Redactor, configurationApi);
_.extend(Redactor, {
    /**
     * Конструкторы блоков всех доступных типов
     */
    blocks: [],

    /**
     * Ссылка на шаблонный движок
     */
    Template: null, // TODO Переименовать на TemplateEngine

    /**
     * Инициализация редактора
     * @param callback
     */
    initialize: function(){
        var d = Q.defer(),
            allBlockTypes;

        // Если редактор инициализирован, ничего не делаем
        if (redactorInitialized) {
            d.resolve();
            return d.promise;
        }

        // Инициализируем конструкторы блоков
        allBlockTypes =
            _.chain(configurationApi.getOption('buildTypes'))
            .pluck('blocks')
            .flatten()
            .uniq()
            .value();
        _.each(allBlockTypes, function(type){
            var blockOptions;

            blockOptions = configurationApi.getOption('blocks')[type];
            if (blockOptions) {
                this.blocks[type] = require(blockOptions.source || './blocks/' + type);
            } else {
                d.reject('Block ' + type + ' is not configured');
            }
        }, this);

        // Иництализируем шаблонный движок
        this.Template = require(configurationApi.getOption('templateEngine'));
        templates.setEngine(this.Template);

        // Инициализируем модули
        _.chain(configurationApi.getOption('modules'))
            .map(function(module){
                return require('./modules/' + module);
            })
            .each(function(moduleInitialization){
                moduleInitialization(Build);
            });

        // Заканчиваем инициализацию
        redactorInitialized = true;
        d.resolve();

        return d.promise;
    },

    /**
     * Конструирование билда из данных
     * @param object    Синхронизатор или данные для дефолтного синхронизатора
     * @param callback  Колбек
     * @returns {*}
     */
    load: function(object){
        var synchronizer;

        if (_.isFunction(object.load)) {
            synchronizer = object;
        } else {
            if (_.isUndefined(object)) {
                throw new Error('Redactor.load expects to receive as the first argument to build data');
            } else {
                synchronizer = new DefaultSynchronizer();
                synchronizer.setData(object);
            }
        }
        
        return this.initialize().then(synchronizer.load.bind(synchronizer)).then(function(data){
            return new Build(data);
        });
    }
});
_.extend(Redactor, {
    Build: Build
});


module.exports = Redactor;
