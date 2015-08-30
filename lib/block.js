var _ = require('underscore');
var Q = require('q');
var components = require('./components');
var React = require('react');


class BaseBlock {
  constructor(data) {
    if (_.isEmpty(data)) {
      data = _.extend({
        type: this.type,
        status: 'ACTIVE'
      }, this.defaults || {});
    }
    this.model = data;
  }

  // FIXME Static!
  get type() {}

  get defaults() {}

  static get title() {}

  get id() {
    return this.model.id || this.model.weight;
  }

  isActive() {
    return this.model.status === 'ACTIVE';
  }

  getPrintTemplate(context='') {
    var templateSource;

    if (context) {
      templateSource = this.getStaticProperty('getPrintTemplate' + context[0].toUpperCase() + context.slice(1));
    }
    if (!templateSource) {
      templateSource = this.getStaticProperty('getPrintTemplate');
    }

    return Q(templateSource);
  }

  static printTemplate() {}

  print(context, filter, globalContext = {}) {
    return Q.all([this.getPrintTemplate(context), this.getPrintContext()]).then(data => {
      var [printTemplateHtml, context] = data;
      var printTemplate;

      printTemplate = new (this.redactor.getTemplateEngine())(printTemplateHtml);

      return printTemplate.render(_.extend({}, context, globalContext));
    });
  }

  getPrintContext() {
    return Q(_.clone(this.model));
  }

  static get formComponent() {
    if (this.form) {
      if (this.form)
      return React.createClass(_.extend({
        getInitialState: function() {
          return this.props.model;
        }
      }, this.form));
    } else {
      return components.BlockForm;
    }
  }

  static get form() {}

  serialize() {
    return _.clone(this.model);
  }
}


class BaseBuildBlock extends BaseBlock {
  constructor(data = {}) {
    super(data);

    this.innerBuild = new (this.getInnerBuildClass())(data.build && data.build.form || {});
    if (data.build && data.build.blocks) {
      this.innerBuild.reset(data.build.blocks);
    }
  }

  getInnerBuildClass() {
    return this.redactor.getBuild(this.buildType);
  }

  get buildType() {}

  print(context, filter, globalContext = {}) {
    return Q.all([
      this.getPrintTemplate(context),
      this.getPrintContext(),
      this.innerBuild.print(context, filter, _.extend({}, globalContext))
    ]).then(data => {
      var [printTemplateHtml, context, innerBuildHtml] = data;
      var printTemplate;

      printTemplate = new (this.redactor.getTemplateEngine())(printTemplateHtml);
      context.innerBuildHtml = innerBuildHtml;

      return printTemplate.render(_.extend({}, context, globalContext));
    });
  }
}


exports.BaseBlock = BaseBlock;
exports.BaseBuildBlock = BaseBuildBlock;
