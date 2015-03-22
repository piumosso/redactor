var ReactTemplate = require('./template').ReactTemplate;
var BlockCollection = require('./collection').BlockCollection;
var BaseBuild = require('./build').BaseBuild;
var BaseBlock = require('./block').BaseBlock;
var BaseBuildBlock = require('./block').BaseBuildBlock;
var allComponents = require('./components');
var ReactFramework = require('react/addons');


class Redactor {
  constructor() {
    this.__blocks = {};
    this.__builds = {};
  }

  addBlock(BlockClass) {
    var that = this;
    var _component = BlockClass.component;
    var _formComponent = BlockClass.formComponent;

    class BindedBlockClass extends BlockClass {
      get redactor() {
        return that;
      }
      get component() {
        return _component;
      }
      get formComponent() {
        return _formComponent;
      }
      getStaticProperty(property) {
        return BindedBlockClass[property];
      }
    }

    this.__blocks[BlockClass.prototype.type] = BindedBlockClass;
  }

  getBlock(type) {
    let blockClass = this.__blocks[type];

    if (blockClass) {
      return blockClass;
    } else {
      throw new Error(`Block ${type} is not defined`);
    }
  }

  addBuild(BuildClass) {
    var that = this;
    var _component = BuildClass.component;
    var _formComponent = BuildClass.formComponent;

    class BindedBuildClass extends BuildClass {
      get redactor() {
        return that;
      }
      get component() {
        return _component;
      }
      get formComponent() {
        return _formComponent;
      }
      getStaticProperty(property) {
        return BindedBuildClass[property];
      }
    }

    this.__builds[BuildClass.prototype.type] = BindedBuildClass;
  }

  getBuild(type) {
    return this.__builds[type];
  }

  getBaseBuild() {
    return BaseBuild;
  }

  getBaseBlock() {
    return BaseBlock;
  }

  getBaseBuildBlock() {
    return BaseBuildBlock;
  }

  getBlockCollection() {
    return BlockCollection;
  }

  load(data) {
    var buildClass;
    var build;

    buildClass = this.__builds[data.type];
    if (!buildClass) {
      throw new Error(`Build ${data.type} is not defined`);
    }

    build = new buildClass(data.form);
    build.reset(data.blocks || []);

    return build;
  }

  getTemplateEngine() {
    return ReactTemplate;
  }

  static get components() {
    return allComponents;
  }

  static get React() {
    return ReactFramework;
  }
}


module.exports = Redactor;
if (typeof window !== 'undefined') {
  window.Redactor = Redactor;
}
