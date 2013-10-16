define('redactor/editable/ContentEditable', [
    'redactor/editable/AbstractEditable'
], function(AbstractEditable){
    var placeholderClass = 'redactor-editable_state_empty'

    return AbstractEditable.extend({
        init: function(){
            this.$el[0].contentEditable = 'true';
        },

        watch: function(){
            var that = this,
                getText = function(){
                    return $.trim(
                        that
                            .$el
                            .find('br')
                                .remove()
                                .end()
                            .html()
                    );
                };

            this.$el.on('focus', _.debounce(function(){
                if (that.$el.hasClass(placeholderClass)) {
                    that.$el.html('').removeClass(placeholderClass);
                }
            }));
            this.$el.on('blur', _.debounce(function(){
                if (_.isEmpty(getText())) {
                    that.$el.html(that.placeholder).addClass(placeholderClass);
                }
            }));
            this.$el.on('keypress', _.debounce(function(){
                that.store(getText());
            }));

            this.$el.trigger('blur');
            this.model.view.trigger('block.contenteditable.watch');
        }
    });
});
