/**
 * Модуль-хранитель шаблонного движка
 */
define('redactor/templates/templates', function(){
    var templateEngine,
        buildTemplate,
        baseBlockTemplate,
        blockTemplates = {};

    return {
        setEngine: function(engine){
            templateEngine = engine;
        },

        getEngine: function(){
            if (templateEngine) {
                return templateEngine;
            } else {
                throw new Error('Перед рендерингом необходимо инициализаровать шаблонный движок');
            }
        },

        setBuildTemplate: function(template){
            buildTemplate = template;
        },

        getBuildTemplate: function(){
            return buildTemplate;
        },

        setBaseBlockTemplate: function(template){
            baseBlockTemplate = template;
        },

        getBaseBlockTemplate: function(){
            return baseBlockTemplate;
        },

        setBlockTemplate: function(type, template){
            blockTemplates[type] = template;
        },

        getBlockTemplate: function(type){
            return blockTemplates[type];
        }
    }
});
