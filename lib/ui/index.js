let React = require('react');
let Store = require('./store');
let BuildComponent = require('./components/build');


var Redactor = React.createClass({
  getInitialState() {
    return {
      build: this.props.storeManager.build
    }
  },

  componentDidMount() {
    this.listeners = [
      this.props.storeManager.buildStore.listen(this.onStoreUpdate),
      this.props.storeManager.adderStore.listen(this.onStoreUpdate)
    ];
  },

  componentWillUnmount() {
    this.listeners.forEach(function(listener) {
      listener();
    });
  },

  onStoreUpdate() {
    this.setState({
      build: this.props.storeManager.build
    });
  },

  render() {
    return <BuildComponent build={this.state.build} storeManager={this.props.storeManager} />;
  }
});


exports.create = function(build, domElement) {
  let storeManager = new Store(build);

  React.render(<Redactor storeManager={storeManager} />, domElement);
};