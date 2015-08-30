let React = require('react');
let BuildFormComponent = require('./build-form');
let CollectionComponent = require('./collection');
let Adder = require('./adder');


module.exports = React.createClass({
  getInitialState() {
    console.info('getInitialState Build');
    return {
      build: this.props.build/*,
      isAdderVisible: false,
      adderPosition: {}*/
    };
  },

  adderShow() {
    //this.setState({isAdderVisible: true});
  },

  adderHide() {
    //this.setState({isAdderVisible: false});
  },

  adderPosition(top) {
    //this.setState({
    //  adderPosition: {top}
    //});
  },

  render() {
    console.info('render Build');
    let BuildForm = this.state.build.formComponent || BuildFormComponent;

    return (
      <section className="redactor-build" onMouseOver={this.adderShow} onMouseOut={this.adderHide}>
        <div className="redactor-build__form">
          <BuildForm build={this.state.build} />
        </div>
        <div className="redactor-build__blocks">
          <CollectionComponent build={this.state.build} />
        </div>
        <Adder build={this.state.build} />
      </section>
    );
  }
});