define('redactor/core/Build', [
    'redactor/config',
    'redactor/core/BlockCollection',
    'redactor/core/blockGetter'
], function(config, BlockCollection, getBlock){

    /**
     * Проверка типа билда
     * @param type  Тип
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
     * @param options   Объект структуры {type[, blocks]}
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
     * Получение типа сборки
     */
    Build.prototype.getType = function(){
        return this.type;
    };

    /**
     * Заполнение сборки блоками
     * @param data  Данные для построения блоков
     */
    Build.prototype.reset = function(data){
        _.each(data, function(dataItem){
            getBlock(dataItem, _.bind(function(block){
                this.add(block);
            }, this));
        });
    };

    /**
     * Добавление в сборку блока в конец или на заданную позицию
     * @param block     Блок
     * @param position  Позиция вставки; если пустая, то в конец
     */
    Build.prototype.add = function(block, position){
        if (this.canReceive(block.getType())) {
            this.blocks.add(block);
            // TODO Учитывать параметр position
        }
    };

    /**
     * Проерка, может ли билд принимать блоки определённого типа
     * @param blockType Тип принимаемого блока
     */
    Build.prototype.canReceive = function(blockType){
        var buildTypeConfig = config.getOption('buildTypes')[this.getType()];

        // TODO вынести провеку в config.config()
        if (_.isUndefined(buildTypeConfig.blocks)) {
            throw new Error('Тип билда ' + this.getType() + ' неправильно сконфигурирован: отсутствует описание блоков');
        }

        return _.has(buildTypeConfig.blocks, blockType);
    };

    return Build;
});
