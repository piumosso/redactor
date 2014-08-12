var _ = require('underscore');
var Q = require('q');


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

    push(block) {
        if (this.canReceive(block.type)) {
            this.blocks.push(block);
        } else {
            throw new Error(`${this.type} can't receive ${block.type}`)
        }
    }

    canReceive(blockType) {
        return _.indexOf(this.blockTypes, blockType) !== -1;
    }

    reset(blockArray) {
        this.blocks.reset(blockArray);
    }
}
BaseBuild.prototype.type = null;
BaseBuild.prototype.blockTypes = [];


class BaseBlock {
    constructor(data={}) {
        this.model = data;
        this.view = {};
    }
}
BaseBlock.prototype.type = null;


class BaseBuildBlock extends BaseBlock {
    constructor(data, build) {
        super(data);
        this.innerBuild = build;
    }
}


class Redactor {
    constructor() {
        this.__blocks = {};
        this.__builds = {};
    }

    block(BlockClass) {
        class BindedBlockClass extends BlockClass {}
        BindedBlockClass.prototype.redactor = this;

        this.__blocks[BlockClass.prototype.type] = BindedBlockClass;
    }

    build(BuildClass) {
        class BindedBuildClass extends BuildClass {}
        BindedBuildClass.prototype.redactor = this;
        
        this.__builds[BuildClass.prototype.type] = BindedBuildClass;
    }

    load(data) {
        return new this.__builds[data.type](data);
    }
}
Redactor.BaseBuild = BaseBuild;
Redactor.BaseBlock = BaseBlock;
Redactor.BaseBuildBlock = BaseBuildBlock;
Redactor.BlockCollection = BlockCollection;


module.exports = Redactor;