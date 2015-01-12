var _ = require('underscore');
var Q = require('q');


class BaseBlock {
    constructor(data={}) {
        this.model = data;
        this.view = {};
    }

    get type() {}

    isActive() {
        return this.model.status === 'ACTIVE';
    }

    getPrintTemplate(context='') {
        var template;

        if (context) {
            template = this['printTemplateString' + context[0].toUpperCase() + context.slice(1)];
        }
        if (!template) {
            template = this.printTemplateString;
        }

        return Q(template);
    }

    get printTemplateString() {}

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
}


class BaseBuildBlock extends BaseBlock {
    constructor(data={}) {
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