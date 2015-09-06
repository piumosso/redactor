let React = require('react');
let BuildFormComponent = require('./build-form');
let CollectionComponent = require('./collection');
let Adder = require('./adder');
let actions = require('../actions');


module.exports = React.createClass({
  getInitialState() {
    return {
      build: this.props.build
    };
  },

  adderShow() {
    actions.buildMouseOver(this.state.build);
  },

  adderHide() {
    actions.buildMouseOut(this.state.build);
  },

  adderPosition(top) {
    //this.setState({
    //  adderPosition: {top}
    //});
  },

  render() {
    let BuildForm = this.state.build.formComponent || BuildFormComponent;

    return (
      <section className="redactor-build" onMouseOver={this.adderShow} onMouseOut={this.adderHide}>
        <div className="redactor-build__form">
          <BuildForm build={this.state.build} storeManager={this.props.storeManager} />
        </div>
        <div className="redactor-build__blocks">
          <CollectionComponent build={this.state.build} storeManager={this.props.storeManager} />
        </div>
        <Adder build={this.state.build} storeManager={this.props.storeManager} />
      </section>
    );
  }
});