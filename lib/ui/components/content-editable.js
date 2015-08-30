let React = require('react');
let actions = require('../actions');


module.exports = React.createClass({
  render() {
    return <span className="redactor-contenteditable" onInput={this.emitChange} onBlur={this.emitChange} contentEditable={true} dangerouslySetInnerHTML={{__html: this.props.model[this.props.property]}}></span>;
  },
  
  emitChange() {
    actions.changeBlockModel(this.props.model, this.props.property, this.getDOMNode().innerHTML);
  }
});
