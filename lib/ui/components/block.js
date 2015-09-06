let React = require('react');
let actions = require('../actions');


let EmptyComponent = React.createClass({
  render() {
    return <div />;
  }
});


module.exports = React.createClass({
  getInitialState() {
    return {
      block: this.props.block
    };
  },

  positionAdder(event) {
    let blockDomNode = React.findDOMNode(this.refs.block);
    let mouseOffset = event.pageY - blockDomNode.offsetParent.offsetTop - blockDomNode.offsetTop;
    let blockDomNodeOffset = blockDomNode.offsetTop;
    let blockDomNodeHeight = blockDomNode.clientHeight;

    if (mouseOffset > blockDomNodeHeight / 2) {
      actions.positionAdder(blockDomNodeOffset + blockDomNodeHeight, this.state.block);
    } else {
      actions.positionAdder(blockDomNodeOffset, this.state.block);
    }
  },
  
  render() {
    let FormComponent = this.state.block.formComponent || EmptyComponent;

    return (
      <article className="redactor-block" onMouseMove={this.positionAdder} ref="block">
        <FormComponent model={this.state.block.model} />
        <div className="redactor-block__handler" />
      </article>
    );
  }
});;