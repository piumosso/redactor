var utils = require('./utils');


var config = {
        blocks: {
            text: {
                verboseName: 'Текст',
                printTemplateDir: __dirname + '/blocks/'
            },
            image: {
                verboseName: 'Изображение',
                printTemplateDir: __dirname + '/blocks/'
            }
        },
        buildTypes: {},
        templateEngine: './templates/Jade',
        editable: 'redactor/editable/ContentEditable',

        baseBlocksPrintTemplateDir: __dirname + '/blocks/',
        defaultBuildTemplate: '',
        defaultBuildTemplateSource: __dirname + '/templates/build.jade',
        defaultBuildPrintTemplate: '',
        defaultBuildPrintTemplateSource: __dirname + '/templates/build.print.jade',
        baseBlockTemplateSource: __dirname + '/templates/block.jade',

        modules: ['sort', 'adder']
    };


module.exports = {
    /**
     * Конфигурация редактора
     * @param options   Объект настроек
     */
    config: function(options){
        // Конфигурация редактора {options} @redactor.config
        config = utils.extend(true, config, options);
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
