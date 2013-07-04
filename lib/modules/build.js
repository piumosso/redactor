define('redactor/modules/Build', [
    'redactor/modules/BlockCollection'
], function(BlockCollection){
    var Build = function(options){
        this.type = options.type;
        this.blocks = new BlockCollection();

        if (!_.isEmpty(options.blocks)) {
            this.reset(options.blocks);
        }
    };

    Build.prototype.checkType = function(type){};
    Build.prototype.reset = function(data){
        _.each(data, function(dataItem){
            console.info('dataItem', dataItem);
        });
    };
    Build.prototype.render = function(){};

    /**
     * Загрузка билда из данных
     * @param data
     */
    Build.load = function(data){
        if (!data.type) {
            throw new Error('Тип билда не определён');
        }
        if (!_.has(config.getOption('buildTypes'), data.type)) {
            throw new Error('Тип билда ' + data.type + ' не опознан');
        }

        return new Build({
            type: data.type,
            blocks: data.blocks || []
        });
    };

    return Build;
});
