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
      <section>{
        this.state.blocks.map(function (block) {
          return <block.component key={block.id} model={block.model} formComponent={block.formComponent} />
        })
      }</section>
    );
  }
});


exports.RedactorCollection = React.createClass({
  render() {
    return (
      <section className="redactor-blocks">
        <RedactorSortableCollection collection={this.props.collection} />
      </section>
    );
  }
});


exports.Build = React.createClass({
  render() {
    return (
      <section className="redactor-build">
        <div className="redactor-build__form">
          <this.props.formComponent form={this.props.form} />
        </div>
        <div className="redactor-build__blocks">
          <this.props.blockCollection.component collection={this.props.blockCollection} />
        </div>
      </section>
    );
  }
});


exports.BuildForm = React.createClass({
  render() {
    return <section />;
  }
});


exports.Block = React.createClass({
  render() {
    return (
      <article className="redactor-block">
        <this.props.formComponent model={this.props.model} />
        <div className="redactor-block__handler" />
      </article>
    );
  }
});


exports.BlockForm = React.createClass({
  render() {
    return <section />;
  }
});


exports.ContentEditable = React.createClass({
  render() {
    return React.createElement('span', {
      onInput: this.emitChange,
      onBlur: this.emitChange,
      contentEditable: true,
      dangerouslySetInnerHTML: {__html: this.props.model[this.props.property]}
    });
  },
  shouldComponentUpdate(nextProps) {
    return nextProps.content !== this.getDOMNode().innerHTML;
  },
  emitChange() {
    var html = this.getDOMNode().innerHTML;

    if (html !== this.lastHtml) {
      this.props.model[this.props.property] = html;
    }

    this.lastHtml = html;
  }
});
