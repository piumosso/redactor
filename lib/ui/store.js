let Reflux = require('reflux');
let actions = require('./actions');


module.exports = class Store {
  constructor(build) {
    this.build = build;
    this.buildStore = this.createStore(build);
  }

  createStore(build) {
    return Reflux.createStore({
      init() {
        this.listenToMany(actions);
      },

      onChangeBlockModel(model, property, value) {
        model[property] = value;
        this.trigger();
      },

      onSortBlocks(collection, newWeightsOrder) {
        collection.sort(newWeightsOrder);
        // Conflict with react-sortable
        // this.trigger();
      }
    });
  }
}