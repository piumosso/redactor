var _ = require('underscore');
var Q = require('q');


class BlockCollection {
  constructor() {
    this.__blocks = [];
  }

  push(block, index) {
    if (_.isNumber(index)) {
      this.__blocks.splice(index, 0, block);
    } else {
      this.__blocks.push(block);
    }
    this.updateWeights();
  }

  updateWeights() {
    _.each(this.__blocks, (block, index) => block.model.weight = index);
  }

  reset(blockArray) {
    this.__blocks = [];
    _.each(blockArray, block => this.push(block));
  }

  getSorted() {
    return _.sortBy(this.__blocks, block => block.model.weight);
  }

  sort(newWeightsOrder) {
    this.__blocks = _.sortBy(this.__blocks, (block) => newWeightsOrder.indexOf(block.model.weight));
    this.updateWeights();
  }

  updateModel(model, property, value) {
    _.invoke(this.__blocks, 'updateModel', model, property, value);
  }

  print(context, filter, globalContext = {}) {
    var blocks;
    var blockDs = [];

    blocks = this.getSorted();
    if (_.isFunction(filter)) {
      blocks = filter(blocks);
    }
    _.each(blocks, block => {
      if (block.isActive()) {
        blockDs.push(block.print(context, filter, globalContext));
      }
    });

    return Q.all(blockDs).then(blocks => blocks.join('\n'));
  }

  serialize() {
    return _.invoke(this.__blocks, 'serialize');
  }
}


exports.BlockCollection = BlockCollection;
