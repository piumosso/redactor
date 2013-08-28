define('redactor/Redactor', [
    'redactor/config',
    'redactor/synchronizers/Default',
    'redactor/core/Build',
    'redactor/templates/templates'
], function(configurationApi, DefaultSynchronizer, Build, templates){
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
                var modulesDeferredArray = [],
                    templateDeferred,
                    allBlockTypes,
                    that = this;

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
                    var deferred = new $.Deferred();

                    modulesDeferredArray.push(deferred);
                    require(['redactor/blocks/' + type], function(Block){
                        that.blocks[type] = Block;
                        deferred.resolve();
                    });
                });
                templateDeferred = new $.Deferred();
                modulesDeferredArray.push(templateDeferred);
                require([configurationApi.getOption('templateEngine')], function(Template){
                    that.Template = Template;
                    templates.setEngine(Template);
                    templateDeferred.resolve();
                });

                $.when.apply({}, modulesDeferredArray).then(function(){
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

    return Redactor;
});
