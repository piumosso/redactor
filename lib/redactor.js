var _ = require('underscore');
var Q = require('q');
var jade = require('jade');


class JadeTemplate {
    constructor(templateString) {
        this.template = new jade.compile(templateString);
    }

    render(context) {
        var d = Q.defer();

        try {
            d.resolve(this.template(context));
        } catch (error) {
            d.reject(error);
        }

        return d.promise;
    }
}


class BlockCollection {
    constructor() {
        this.__blocks = [];
    }

    push(block, index) {
        if (_.isNumber(index)) {
            this.__blocks.splice(index, 0, block);
        } else {
            this.__blocks.push(block);
        }
        this.updateWeights();
    }

    updateWeights() {
        _.each(this.__blocks, (block, index) => block.model.weight = index);
    }

    reset(blockArray) {
        this.__blocks = [];
        _.each(blockArray, block => this.push(block));
    }

    getSorted() {
        return _.sortBy(this.__blocks, block => block.model.weight);
    }

    print(context, filter, globalContext) {
        var blocks;
        var blockDs;

        blocks = this.getSorted();
        if (_.isFunction(filter)) {
            blocks = filter(blocks);
        }
        blockDs = _.map(blocks, block => block.isActive() && block.print(context, filter, globalContext));

        return Q.all(blockDs).then(blocks => blocks.join('\n'));
    }
}


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
        _.each(blockArray, block => this.push(block))
    }

    print(context, filter, globalContext) {
        return this.printTemplate().then(printTemplateHtml => {
            var printTemplate;

            printTemplate = new (this.redactor.getTemplateEngine())(printTemplateHtml);

            return this.blocks.print(context, filter, globalContext).then(blocksHtml => printTemplate.render({
                type: this.getType(),
                form: this.getForm(),
                context,
                blocksHtml: blocksHtml
            }));
        });
    }

    printTemplate() {
        return Q('= blocksHtml');
    }
}


class BaseBlock {
    constructor(data={}) {
        this.model = data;
        this.view = {};
    }

    get type() {}

    isActive() {
        return true;
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

    print(context, globalContext = {}) {
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
    constructor(data, build) {
        super(data);
        this.innerBuild = build;
    }

    getPrintContext() {
        // TODO + innerBuild
    }
}


class Redactor {
    constructor() {
        this.__blocks = {};
        this.__builds = {};
    }

    addBlock(BlockClass) {
        var that = this;

        class BindedBlockClass extends BlockClass {
            get redactor() {
                return that;
            }
        }

        this.__blocks[BlockClass.prototype.type] = BindedBlockClass;
    }

    getBlock(type) {
        return this.__blocks[type];
    }

    addBuild(BuildClass) {
        var that = this;

        class BindedBuildClass extends BuildClass {
            get redactor() {
                return that;
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
        return new this.__builds[data.type](data);
    }

    getTemplateEngine() {
        return JadeTemplate;
    }
}

module.exports = Redactor;