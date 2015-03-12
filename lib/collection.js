var _ = require('underscore');
var Q = require('q');
var SortableMixin = require('sortablejs/react-sortable-mixin');


var _sortableListComponent = React.createClass({
  mixins: [SortableMixin],

  sortableOptions: {
    handle: '.redactor-block__handler',
    model: 'blocks'
  },

  getInitialState() {
    return {
      blocks: this.props.collection.__blocks
    };
  },

  handleSort() {
    this.state.blocks.forEach(function(block, i) {
      block.model.weight = i;
    });
  },

  render() {
    return React.createElement('section', {},
      this.state.blocks.map(function (block) {
        return React.createElement(block.component, {key: block.id, model: block.model, formComponent: block.formComponent});
      })
    );
  }
});


var _component = React.createClass({
  render() {
     return React.createElement('section', {className: 'redactor-blocks'},
      React.createElement(_sortableListComponent, {
        collection: this.props.collection
      })
    );
  }
});


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

  get component() {
    return _component;
  }
}


exports.BlockCollection = BlockCollection;
