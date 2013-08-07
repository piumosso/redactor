define('redactor/templates/templates', function(){
    var templateEngine;

    return {
        set: function(engine){
            templateEngine = engine;
        },

        get: function(){
            if (templateEngine) {
                return templateEngine;
            } else {
                throw new Error('Перед рендерингом необходимо инициализаровать шаблонный движок');
            }
        }
    }
});
