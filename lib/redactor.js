class BaseBuild {
}


class BaseBlock {
    constructor() {
        this.model = {};
        this.view = {};
    }
}


class BaseBuildBlock extends BaseBlock {
    constructor() {
        super();
        this.innerBuild = new Build();
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


module.exports = Redactor;