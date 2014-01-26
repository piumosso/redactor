/**
 * Конструирование блока из данных
 * @param data      Данные (объект); обязательно должен быть определён атрибут type
 */
function getBlock(data){
    var api = require('redactor/Redactor');

    if (!data.type) {
        throw new Error('Тип блока должен быть определён');
    }
    if (_.isUndefined(api.blocks[data.type])) {
        throw new Error('Тип блока ' + data.type + ' не доступен');
    }

    return new api.blocks[data.type](data);
};
// TODO Возможно, стоит перенести к блоку


module.exports = getBlock;
