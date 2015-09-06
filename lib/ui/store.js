let Reflux = require('reflux');
let actions = require('./actions');


module.exports = class Store {
  constructor(build) {
    this.build = build;
    this.buildStore = this.createBuildStore();
    this.adder = {
      build: null,
      position: 0
    };
    this.adderStore = this.createAdderStore(this.adder);
  }

  createBuildStore() {
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

  createAdderStore(adder) {
    return Reflux.createStore({
      init() {
        this.listenToMany(actions);
      },

      onBuildMouseOver(build) {
        adder.build = build;
        this.trigger();
      },

      onBuildMouseOut(build) {
        adder.build = null;
        this.trigger();
      },

      onPositionAdder(position) {
        adder.position = position;
        this.trigger();
      }
    });
  }
}