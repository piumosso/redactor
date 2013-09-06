define('redactor/editable/ContentEditable', [
    'redactor/editable/AbstractEditable'
], function(AbstractEditable){
    return AbstractEditable.extend({
        init: function(){
            this.$el[0].contentEditable = 'true';
        },

        watch: function(){
            var that = this;

            this.$el.on('keypress', _.debounce(function(){
                that.store(that.$el.html());
            }));
        }
    });
});
