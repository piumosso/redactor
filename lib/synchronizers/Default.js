define('redactor/synchronizers/Default', function(){
    var DefaultSynchronizer = function(){
        this.data = null;
    };

    /**
     * Задание данных
     * @param data
     */
    DefaultSynchronizer.prototype.setData = function(data){
        this.data = data;
    };

    /**
     * Получение данных
     * @param callback
     */
    DefaultSynchronizer.prototype.load = function(callback){
        if (_.isFunction(callback)) {
            callback(this.data);
        }
    };


    return DefaultSynchronizer;
});
