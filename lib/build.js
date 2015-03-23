var _ = require('underscore');
var Q = require('q');
var BlockCollection = require('./collection').BlockCollection;
var components = require('./components');
var React = require('react');


class BaseBuild {
  constructor(formData = {}) {
    this.form = formData;
    this.blocks = new BlockCollection();
  }

  get type() {
  }

  get blockTypes() {
    return [];
  }

  push(block) {
    if (this.canReceive(block.type)) {
      this.blocks.push(block);
    } else {
      throw new Error(`${this.type} can't receive ${block.type}`);
    }
  }

  canReceive(blockType) {
    return _.indexOf(this.blockTypes, blockType) !== -1;
  }

  reset(blockArray) {
    this.blocks.reset();
    _.each(blockArray, block => this.push(new (this.redactor.getBlock(block.type))(block)));
  }

  getPrintTemplate(context) {
    var templateSource;

    if (context) {
      templateSource = this.getStaticProperty('getPrintTemplate' + context[0].toUpperCase() + context.slice(1));
    }
    if (!templateSource) {
      templateSource = this.getStaticProperty('getPrintTemplate');
    }

    return Q(templateSource);
  }

  static getPrintTemplate() {
    return <section dangerouslySetInnerHTML={{__html: this.props.blocksHtml}} />;
  }

  print(context, filter, globalContext = {}) {
    return this.getPrintTemplate(context).then(printTemplateSource => {
      var printTemplate;

      printTemplate = new (this.redactor.getTemplateEngine())(printTemplateSource);
      _.extend(globalContext, {
        build: {
          type: this.type,
          form: this.form
        }
      });

      return this.blocks.print(context, filter, globalContext).then(blocksHtml => printTemplate.render(_.extend({
        type: this.type,
        context,
        blocksHtml
      }, globalContext)));
    });
  }

  static get component() {
    return components.Build;
  }

  static get formComponent() {
    return components.BuildForm;
  }

  attach(domElement) {
    React.render(<this.component build={this} />, domElement);

    return this;
  }
}


exports.BaseBuild = BaseBuild;
