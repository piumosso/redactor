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
    this.props.collection.__blocks.forEach((block, i) => {
      block.model.weight = i;
    });
  },

  render() {
    return (
      <section>{
        this.props.collection.__blocks.map(block => {
          return <block.component key={block.id} model={block.model} formComponent={block.formComponent} positionAdder={this.props.positionAdder} />
        })
      }</section>
    );
  }
});


exports.RedactorCollection = React.createClass({
  render() {
    return (
      <section className="redactor-blocks">
        <RedactorSortableCollection collection={this.props.collection} positionAdder={this.props.positionAdder} />
      </section>
    );
  }
});


exports.Build = React.createClass({
  getInitialState() {
    return {
      build: this.props.build,
      isAdderVisible: false,
      adderPosition: {}
    };
  },
  addBlock(type) {
    this.state.build.push(new (this.state.build.redactor.getBlock(type))());
    this.setState({build: this.state.build});
  },
  adderShow() {
    this.setState({isAdderVisible: true});
  },
  adderHide() {
    this.setState({isAdderVisible: false});
  },
  adderPosition(top) {
    console.info('adderPosition', top);
    this.setState({
      adderPosition: {top}
    });
  },
  render() {
    let adderClassName = 'redactor-adder';
    if (this.state.isAdderVisible) {
      adderClassName += ' redactor-adder_visible';
    }

    return (
      <section className="redactor-build" onMouseOver={this.adderShow} onMouseOut={this.adderHide}>
        <div className="redactor-build__form">
          <this.state.build.formComponent form={this.state.build.form} />
        </div>
        <div className="redactor-build__blocks">
          <this.state.build.blocks.component collection={this.state.build.blocks} positionAdder={this.adderPosition} />
        </div>
        <aside className={adderClassName} style={this.state.adderPosition}>
          <span className="redactor-adder__wrapper">
            {
              this.state.build.blockTypes.map(block => {
                let blockClass = this.state.build.redactor.getBlock(block);
                let className = `redactor-adder__item redactor-adder__item_type_${block}`;

                return <span className={className}>
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
  positionAdder(event) {
    let blockDomNode = React.findDOMNode(this.refs.block);
    let mouseOffset = event.pageY - blockDomNode.offsetParent.offsetTop - blockDomNode.offsetTop;
    let blockDomNodeOffset = blockDomNode.offsetTop;
    let blockDomNodeHeight = blockDomNode.clientHeight;

    if (mouseOffset > blockDomNodeHeight / 2) {
      this.props.positionAdder(blockDomNodeOffset + blockDomNodeHeight);
    } else {
      this.props.positionAdder(blockDomNodeOffset);
    }
  },
  render() {
    return (
      <article className="redactor-block" onMouseMove={this.positionAdder} ref="block">
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
