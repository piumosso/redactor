define('redactor/Redactor', [
    'redactor/modules/Build',
    'redactor/modules/Block'
], function(Build, Block){
    var Redactor = {},
        config;

    // Публичное API
    _.extend(Redactor, {
        /**
         * Конфигурация редактора
         * @param options
         */
        config: function(options){
            _.extend(config, options);
        },

        /**
         * Получение настройки
         * @param optionName
         */
        getOption: function(optionName, defaultValue){
            if (_.has(config, optionName)) {
                return config[optionName];
            } else {
                if (_.isUndefined(defaultValue)) {
                    throw new Error('Настройка "' + optionName + '" должна быть определена');
                } else {
                    return defaultValue;
                }
            }
        }
    });

    return Redactor;
});
