var configurationApi = require('./config'),
    DefaultSynchronizer = require('./synchronizers/Default'),
    Build = require('./core/Build'),
    templates = require('./templates/templates');


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
     * Ссылкана шаблонный движок
     */
    Template: null,

    /**
     * Инициализация редактора
     * @param callback
     */
    initialize: function(callback){
        if (!redactorInitialized) {
            var ds = [],
                templateD = new $.Deferred(),
                moduleD = new $.Deferred(),
                moduleDs = [],
                allBlockTypes,
                that = this;

            // Инициализируем конструкторы блоков
            allBlockTypes = _.uniq(
                _.reduce(
                    configurationApi.getOption('buildTypes'),
                    function(mem, i){
                        return _.union(mem, i.blocks)
                    },
                    []
                )
            );
            _.each(allBlockTypes, function(type){
                var d = new $.Deferred();

                ds.push(d);
                require(['redactor/blocks/' + type], function(Block){
                    that.blocks[type] = Block;
                    d.resolve();
                });
            });

            // Иництализируем шаблонный движок
            ds.push(templateD);
            require([configurationApi.getOption('templateEngine')], function(Template){
                that.Template = Template;
                templates.setEngine(Template);
                templateD.resolve();
            });

            // Инициализируем модули
            ds.push(moduleD);
            _.each(configurationApi.getOption('modules'), function(module){
                var d = new $.Deferred();

                require(['redactor/modules/' + module], function(moduleInitialization){
                    d.resolve(moduleInitialization);
                });

                moduleDs.push(d);
            });
            $.when.apply({}, moduleDs).then(function(){
                _.each(arguments, function(moduleInitialization){
                    moduleInitialization();
                });
                moduleD.resolve();
            });

            // Заканчиваем инициализацию
            $.when.apply({}, ds).then(function(){
                redactorInitialized = true;
                callback();
            });
        } else{
            callback();
        }
    },

    /**
     * Конструирование билда из данных
     * @param object    Синхронизатор или данные для дефолтного синхронизатора
     * @param callback  Колбек
     * @returns {*}
     */
    load: function(object, callback){
        var load = function(){
            var synchronizer;

            if (_.isFunction(object.load)) {
                synchronizer = object;
            } else {
                if (_.isUndefined(object)) {
                    throw new Error('Redactor.load ожидает получить в качестве первого аргумента данные для билда');
                } else {
                    synchronizer = new DefaultSynchronizer();
                    synchronizer.setData(object);
                }
            }

            synchronizer.load(function(data){
                var build = new Build(data);

                if (_.isFunction(callback)) {
                    callback(build);
                }
            });
        };

        this.initialize(load);
    }
});
_.extend(Redactor, {
    Build: Build
});


module.exoprts = Redactor;
