let React = require('react');
let actions = require('../actions');


module.exports = React.createClass({
  getInitialState() {
    return {};
  },

  getAdderClassName() {
    let adderClassName = 'redactor-adder';

    if (this.props.storeManager.adder.build === this.props.build) {
      adderClassName += ' redactor-adder_visible';
    }

    return adderClassName;
  },

  getAdderPosition() {
    return {
      top: this.props.storeManager.adder.position
    };
  },

  addBlock(type) {
    actions.addBlock(type);
  },

  render() {

    return (
      <aside className={this.getAdderClassName()} style={this.getAdderPosition()}>
        <span className="redactor-adder__wrapper">
          {
            this.props.build.blockTypes.map((blockType, id) => {
              let blockClass = this.props.build.redactor.getBlock(blockType);
              let className = `redactor-adder__item redactor-adder__item_type_${blockType}`;

              return <span className={className} key={id}>
                <span className="redactor-adder__title redactor-adder__title_type_placeholder">{blockClass.title}</span>
                <div className="redactor-adder__item-icon" onClick={this.addBlock.bind(this, blockType)}>{blockType}</div>
              </span>;
            })
            }
        </span>
      </aside>
    );
  }
});