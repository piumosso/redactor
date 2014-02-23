var Q = require('q');


function DefaultSynchronizer(){
    this.data = null;
}


/**
 * Задание данных
 * @param data  Данные
 */
DefaultSynchronizer.prototype.setData = function(data){
    this.data = data;
};


/**
 * Получение данных
 */
DefaultSynchronizer.prototype.load = function(){
    var d = Q.defer();

    d.resolve(this.data);

    return d.promise;
};


module.exports = DefaultSynchronizer;
