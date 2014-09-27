require('traceur');
var _ = require('underscore');
var Q = require('q');
var BlockCollection = require('./collection').BlockCollection;


class BaseBuild {
    constructor(formData={}) {
        this.form = formData;
        this.blocks = new BlockCollection();
    }

    get type() {}

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
        var template;

        if (context) {
            template = this['printTemplateString' + context[0].toUpperCase() + context.slice(1)];
        }
        if (!template) {
            template = this.printTemplateString;
        }

        return Q(template);
    }

    get printTemplateString() {
        return '!= blocksHtml';
    }

    print(context, filter, globalContext={}) {
        return this.getPrintTemplate(context).then(printTemplateHtml => {
            var printTemplate;

            printTemplate = new (this.redactor.getTemplateEngine())(printTemplateHtml);
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
}


exports.BaseBuild = BaseBuild;