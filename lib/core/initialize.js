/**
 * Примесь инициализации для классов различных сущностей
 */
define('redactor/core/initialize', function(){
    return {
        /**
         * Инициализация
         * Вызываются все методы, начинающиеся с initialize
         */
        initialize: function(){
            for (var prop in this) {
                if (prop != 'initialize' && prop.indexOf('initialize') === 0) {
                    this[prop]();
                }
            }
        }
    };
});
