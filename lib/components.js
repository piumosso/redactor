var SortableMixin = require('sortablejs/react-sortable-mixin');


var RedactorSortableCollection = React.createClass({
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
    return (
      <section>
        this.state.blocks.map(function (block) {
          return React.createElement(block.component, {key: block.id, model: block.model, formComponent: block.formComponent});
        })
      </section>
    );
  }
});


var RedactorCollection = React.createClass({
  render() {
    return (
      <section class="redactor-blocks">
        <RedactorSortableCollection collection="this.props.collection" />
      </section>
    );
  }
});


module.exports.RedactorCollection = RedactorCollection;
