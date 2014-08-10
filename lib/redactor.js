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
    constructor(formData) {
        this.form = formData;
        this.blocks = new BlockCollection();
    }
    push(block) {
        this.blocks.push(block);
    }
}
BaseBuild.prototype.type = null;


class BaseBlock {
    constructor(data) {
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
        this.__blocks[BlockClass.prototype.type] = BlockClass;
    }

    build(BuildClass) {
        this.__builds[BuildClass.prototype.type] = BuildClass;
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