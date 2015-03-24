var React = require('react');
var SortableMixin;

if (process && process.browser) {
  SortableMixin = require('sortablejs/react-sortable-mixin');
}

var RedactorSortableCollection = React.createClass({
  mixins: [SortableMixin],

  sortableOptions: {
    handle: '.redactor-block__handler',
    model: 'blocks'
  },

  handleSort() {
    this.props.collection.__blocks.forEach(function(block, i) {
      block.model.weight = i;
    });
  },

  render() {
    return (
      <section>{
        this.props.collection.__blocks.map(function (block) {
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
  getInitialState() {
    return {
      build: this.props.build
    };
  },
  addBlock(type) {
    this.state.build.push(new (this.state.build.redactor.getBlock(type))());
    this.setState({build: this.state.build});
  },
  render() {
    return (
      <section className="redactor-build">
        <div className="redactor-build__form">
          <this.state.build.formComponent form={this.state.build.form} />
        </div>
        <div className="redactor-build__blocks">
          <this.state.build.blocks.component collection={this.state.build.blocks} />
        </div>
        <aside className="redactor-adder">
          <span className="redactor-adder__wrapper">
            {
              this.state.build.blockTypes.map(block => {
                let blockClass = this.state.build.redactor.getBlock(block);
                let cx = React.addons.classSet;
                let classes = cx('redactor-adder__item', 'redactor-adder__item_type_' + block);
                return <span className={classes}>
                  <span className="redactor-adder__title redactor-adder__title_type_placeholder">{blockClass.title}</span>
                  <div className="redactor-adder__item-icon" onClick={this.addBlock.bind(this, block)}>{block}</div>
                </span>;
              })
            }
          </span>
        </aside>
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
    return <div />;
  }
});


exports.ContentEditable = React.createClass({
  render() {
    return <span className="redactor-contenteditable" onInput={this.emitChange} onBlur={this.emitChange} contentEditable={true} dangerouslySetInnerHTML={{__html: this.props.model[this.props.property]}}></span>;
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
