define('redactor/Redactor', [
    'redactor/modules/Build',
    'redactor/modules/Block'
], function(Build, Block){
    var Redactor = {},
        config = {
            blocks: [],
            buildTypes: {},
            sync: null
        };

    // Публичное API
    _.extend(Redactor, {
        /**
         * Конфигурация редактора
         * @param options
         */
        config: function(options){
            // Конфигурация редактора {options} @redactor.config
            _.extend(config, options);
        },

        /**
         * Получение настройки
         * @param optionName
         */
        getOption: function(optionName, defaultValue){
            // Получение настройки {optionName} @redactor.config
            if (_.has(config, optionName)) {
                // Нашлось значение {config[optionName]} @redactor.config
                return config[optionName];
            } else {
                if (_.isUndefined(defaultValue)) {
                    throw new Error('Настройка "' + optionName + '" должна быть определена');
                } else {
                    // Возвращаем значение по умолчанию {defaultValue} @redactor.config
                    return defaultValue;
                }
            }
        }
    });

    return Redactor;
});
