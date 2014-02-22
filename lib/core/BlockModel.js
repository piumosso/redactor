var BlockModel,
    Backbone = require('backbone');


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
