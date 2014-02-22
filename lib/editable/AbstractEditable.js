var _ = require('underscore');


function AbstractEditable($el, model){
    this.$el = $el.eq(0);
    this.model = model;
    this.field = this.$el.data('field');
    this.placeholder = this.$el.data('placeholder');

    this.init();
    this.watch();
};


/**
 * Инициализация wysiwyg
 */
AbstractEditable.prototype.init = function(){
    throw new Error('Не определён метод инициализации wysiwyg');
};


/**
 * лежение за изменением введённого текста
 */
AbstractEditable.prototype.watch = function(){
    throw new Error('Не определён метод слежения за изменением поля');
};


/**
 * Сохранение нового значения в модель
 * @param newValue
 */
AbstractEditable.prototype.store = function(newValue){
    this.model.set(this.field, newValue);
};


/**
 * Создание своего класса
 * @param methods
 */
AbstractEditable.extend = function(methods){
    var constructor = function(){
        AbstractEditable.apply(this, arguments);
    };

    constructor.prototype = AbstractEditable.prototype;
    _.extend(constructor.prototype, methods);

    return constructor;
};


module.export = AbstractEditable;
