define('redactor/core/Build', [
    'redactor/config',
    'redactor/core/BlockCollection'
], function(config, BlockCollection){

    /**
     * Проверка типа билда
     * @param type
     */
    var checkBuildType = function(type){
        if (!type) {
            throw new Error('Тип билда не определён');
        }
        if (!_.has(config.getOption('buildTypes'), type)) {
            throw new Error('Тип билда ' + type + ' не опознан');
        }

        return type;
    };

    /**
     * Сборка редактора
     *
     * @param options object {type[, blocks]}
     * @constructor
     */
    var Build = function(options){
        // Основные атрибуты сборки
        this.type = checkBuildType(options.type);
        this.blocks = new BlockCollection();

        // Инициализация атрибутов
        if (!_.isEmpty(options.blocks)) {
            this.reset(options.blocks);
        }
    };

    /**
     * Установка данных в коллекцию блоков
     * @param data Данные для построения блоков
     */
    Build.prototype.reset = function(data){
        _.each(data, function(dataItem){
            console.info('dataItem', dataItem);
        });
    };

    // Build.prototype.render = function(){};

    return Build;
});
