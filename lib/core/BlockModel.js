define('redactor/core/BlockModel', function(){
    return Backbone.Model.extend({
        defaults: {
            type: null,
            weight: 0,
            status: 'ACTIVE'
        },

        toString: function(){
            return this.get('type');
        }
    });
});
