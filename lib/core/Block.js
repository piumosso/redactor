define('redactor/core/Block', function(){
    return Backbone.Model.extend({
        defaults: {
            type: null,
            weight: 0
        },

        getType: function(){
            return this.get('type');
        }
    });
});
