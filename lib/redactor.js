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
        load: function(data){
            var makeBuild,
                parentBuild,
                sync;

            sync = Redactor.getOption('sync');
            if (sync) {
                data = sync.load();
            } else {
                if (_.isUndefined(data)) {
                    throw new Error('Данные должны быть переданы, если нет загрузчика');
                }
            }

            makeBuild = function(buildData){
                if (!buildData.type) {
                    throw new Error('Тип билда не определён');
                }
                if (!_.has(Redactor.getOption('buildTypes'), buildData.type)) {
                    throw new Error('Тип билда ' + buildData.type + ' не опознан');
                }

                return new Build({
                    blocks: buildData.blocks || []
                });
            };
            parentBuild = makeBuild(data);

            return parentBuild;
        }
    });

    return Redactor;
});
