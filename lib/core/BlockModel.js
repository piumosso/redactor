define('redactor/core/BlockModel', function(){
    return Backbone.Model.extend({
        defaults: {
            type: null,
            weight: 0
        }
    });
});
