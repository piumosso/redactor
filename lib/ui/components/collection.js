let React = require('react');
let SortableMixin = require('sortablejs/react-sortable-mixin');
let BlockComponent = require('./block');
let actions = require('../actions');


module.exports = React.createClass({
  mixins: [SortableMixin],

  sortableOptions: {
    handle: '.redactor-block__handler',
    model: 'blocks'
  },

  getInitialState() {
    return {
      blocks: this.props.build.blocks.__blocks
    };
  },

  handleSort() {
    actions.sortBlocks(this.props.build.blocks, this.state.blocks.map((block) => block.model.weight));
  },

  render() {
    return (
      <section className="redactor-blocks">{
        this.state.blocks.map(block => {
          return <BlockComponent key={block.id} block={block} storeManager={this.props.storeManager} />
        })
      }</section>
    );
  }
});
