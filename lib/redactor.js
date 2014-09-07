require('traceur');
var _ = require('underscore');
var Q = require('q');


var JadeTemplate = require('./template').JadeTemplate;
var BlockCollection = require('./collection').BlockCollection;
var BaseBuild = require('./build').BaseBuild;
var BaseBlock = require('./block').BaseBlock;
var BaseBuildBlock = require('./block').BaseBuildBlock;


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
        var build = new this.__builds[data.type](data.form);

        build.reset(data.blocks || []);

        return build;
    }

    getTemplateEngine() {
        return JadeTemplate;
    }
}


module.exports = Redactor;
if (typeof window !== 'undefined') {
    window.Redactor = Redactor;
}