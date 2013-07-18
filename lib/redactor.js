define('redactor/Redactor', [
    'redactor/config',
    'redactor/synchronizers/Default',
    'redactor/core/Build'
], function(configurationApi, DefaultSynchronizer, Build){
    var Redactor = {};

    // Публичное API
    _.extend(Redactor, configurationApi);
    _.extend(Redactor, {
        /**
         * Конструирование билда из данных
         * @param object Синхронизатор или данные для дефолтного синхронизатора
         * @param callback
         * @returns {*}
         */
        load: function(object, callback){
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
        }
    });

    return Redactor;
});
