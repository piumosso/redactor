var config = {
        blocks: {
            text: {
                verboseName: 'Текст'
            },
            image: {
                verboseName: 'Изображение'
            }
        },
        buildTypes: {},
        templateEngine: './templates/Jade',
        editable: 'redactor/editable/ContentEditable',

        defaultBuildTemplate: '',
        defaultBuildTemplateSource: 'redactor/templates/build.jade',
        defaultBuildPrintTemplate: '',
        defaultBuildPrintTemplateSource: 'redactor/templates/build.print.jade',
        baseBlockTemplateSource: 'redactor/templates/block.jade',

        modules: ['sort', 'adder']
    };


function deepObjectExtend(target, source) {
    for (var prop in source)
        if (prop in target) {
            deepObjectExtend(target[prop], source[prop]);
        } else {
            target[prop] = source[prop];
        }

    return target;
}


module.exports = {
    /**
     * Конфигурация редактора
     * @param options   Объект настроек
     */
    config: function(options){
        // Конфигурация редактора {options} @redactor.config
        deepObjectExtend(config, options);
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
