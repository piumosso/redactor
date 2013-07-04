define('redactor/Redactor', [
    'redactor/config',
], function(configurationApi){
    var Redactor = {};

    // Публичное API
    _.extend(Redactor, configurationApi);
    _.extend(Redactor, {
        /**
         * Конструирование билда из данных
         * @param data
         * @returns {*}
         */
        load: function(data){
            var sync;

            sync = Redactor.getOption('sync');
            if (sync) {
                data = sync.load();
            } else {
                if (_.isUndefined(data)) {
                    throw new Error('Данные должны быть переданы, если нет загрузчика');
                }
            }

            return Build.load(data);
        }
    });

    return Redactor;
});
