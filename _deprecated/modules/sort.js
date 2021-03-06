module.exports = function(Build){
    Build.prototype.initializeSort = function(){
        this.once('build.render', _.bind(this.sortBind, this));
        this.on('build.sort.stop', _.bind(this.onSortStop, this));
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
        this.trigger('build.sort.start');
    };

    /**
     * Окончание сортировки
     * @param e
     * @param ui
     */
    Build.prototype.sortStop = function(e, ui){
        this.trigger('build.sort.stop');
    };

    /**
     * Когда сортировка закончена
     */
    Build.prototype.onSortStop = function(){
        this.blockCollection.sort(function(block){
            var weight = block.$el.index();

            block.model.set({weight: weight});

            return weight;
        });
    };
};
