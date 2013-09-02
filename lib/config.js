define('redactor/config', function(){
    var config = {
            blocks: [],
            buildTypes: {},
            templateEngine: 'redactor/templates/Plate',

            defaultBuildTemplate: '',
            defaultBuildTemplateSource: 'redactor/templates/build.html',
            baseBlockTemplateSource: 'redactor/templates/block.html',

            modules: ['sort', 'adder']
        };

    return {
        /**
         * Конфигурация редактора
         * @param options   Объект настроек
         */
        config: function(options){
            // Конфигурация редактора {options} @redactor.config
            _.extend(config, options);
        },

        /**
         * Получение настройки
         * @param optionName    Название настройки
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
    };
});
