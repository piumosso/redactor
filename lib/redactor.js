define('redactor/Redactor', [
    'redactor/modules/Build',
    'redactor/modules/Block'
], function(Build, Block){
    var Redactor = {},
        config = {
            blocks: [],
            buildTypes: {},
            sync: false
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
        },

        /**
         * Конструирование билда из данных
         * @param options
         * @returns {*}
         */
        make: function(data){
            var makeBuild,
                parentBuild;

            makeBuild = function(data){
                if (!data.type) {
                    throw new Error('Тип билда не определён');
                }
                if (!_.has(Redactor.getOption('buildTypes'), data.type)) {
                    throw new Error('Тип билда ' + data.type + ' не опознан');
                }

                return new Build({
                    blocks: data.blocks || []
                });
            };
            parentBuild = makeBuild(data);

            return parentBuild;
        }
    });

    return Redactor;
});
