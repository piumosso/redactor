define('redactor/modules/sort', [
    'redactor/core/Build'
], function(Build){
    return function(){
        Build.prototype.initializeSort = function(){
            this.once('render', _.bind(this.sortBind, this));
            this.on('sort-stop', _.bind(this.onSortStop, this));
        };

        /**
         * Сортировка в DOM'е (инициализация плагина)
         */
        Build.prototype.sortBind = function(){
            $('.js-blocks', this.el).sortable({
                handle: '.js-redactor-block-handler',
                placeholder: 'redactor-block-placeholder',
                start: _.bind(this.sortStart, this),
                stop: _.bind(this.sortStop, this)
            });
        };

        /**
         * Начало сортировки
         * @param e
         * @param ui
         */
        Build.prototype.sortStart = function(e, ui){
            ui.placeholder.height(ui.item.height());
            this.trigger('sort-start');
        };

        /**
         * Окончание сортировки
         * @param e
         * @param ui
         */
        Build.prototype.sortStop = function(e, ui){
            this.trigger('sort-stop');
        };

        /**
         * Когда сортировка закончена
         */
        Build.prototype.onSortStop = function(){
            _.each(this.blockCollection, function(block){
                block.model.set({weight: block.$el.index()})
            });
        };
    };
});
