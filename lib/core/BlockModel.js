var BlockModel;


BlockModel = Backbone.Model.extend({
    defaults: {
        type: null,
        weight: 0,
        status: 'ACTIVE'
    },

    toString: function(){
        return this.get('type');
    }
});


module.exports = BlockModel;
