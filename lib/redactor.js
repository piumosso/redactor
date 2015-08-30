let ReactTemplate = require('./template').ReactTemplate;
let BlockCollection = require('./collection').BlockCollection;
let BaseBuild = require('./build').BaseBuild;
let BaseBlock = require('./block').BaseBlock;
let BaseBuildBlock = require('./block').BaseBuildBlock;
let React = require('react/addons');
let ContentEditable = require('./ui/components/content-editable');


class Redactor {
  constructor() {
    this.__blocks = {};
    this.__builds = {};
  }

  addBlock(BlockClass) {
    var that = this;
    var _formComponent = BlockClass.formComponent;

    class BindedBlockClass extends BlockClass {
      get redactor() {
        return that;
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
    var _formComponent = BuildClass.formComponent;

    class BindedBuildClass extends BuildClass {
      get redactor() {
        return that;
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
    return BaseBuild; // wtf
  }

  getBaseBlock() {
    return BaseBlock; // wtf
  }

  getBaseBuildBlock() {
    return BaseBuildBlock; // wtf
  }

  getBlockCollection() {
    return BlockCollection; // wtf
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
}


Redactor.components = {
  ContentEditable
};
Redactor.React = React;


module.exports = Redactor;
if (typeof window !== 'undefined') {
  window.Redactor = Redactor;
}
