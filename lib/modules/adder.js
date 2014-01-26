var adderTemplate,
    adderTitlePlaceholderClass = 'redactor-adder__title_type_placeholder',
    config = require('../config'),
    getBlock = require('../core/blockGetter'),
    Build = require('../core/Build'),
    templates = require('../templates/templates'),
    adderHtml = fs.readFileSync(__dirname + '../templates/adder.html');


module.exports = function(Build){
    Build.prototype.initializeAdder = function(){
        var that = this;

        adderTemplate = new (templates.getEngine())(adderHtml);
        this.once('build.render', function(){
            that.renderAdder(function(){
                that.bindAdderEvents();
            });
        });
    };

    Build.prototype.renderAdder = function(callback){
        var that = this,
            buildTypeOptions = config.getOption('buildTypes')[that.getType()],
            context = {
                blocks: _.map(config.getOption('blocks'), function(block, type){
                    if (_.indexOf(buildTypeOptions.blocks, type) != -1) {
                        block.type = type;
                        return block;
                    }
                }),
                type: buildTypeOptions.name
            };

        adderTemplate.render(context, function(html){
            that.$el.find('.js-blocks').after(html);
            callback();
        });
    };

    Build.prototype.bindAdderEvents = function(){
        var $title = $('.js-adder-title', this.$el),
            titlePlaceholderText = $title.html();

        this.$el.on('click', '.js-adder-item', _.bind(this.onAdderClick, this));
        this.$el.on('mouseenter', '.js-adder-item', function(e){
            $title.removeClass(adderTitlePlaceholderClass).html(
                $(e.target).data('name')
            );
        });
        this.$el.on('mouseleave', '.js-adder-item', function(){
            $title.addClass(adderTitlePlaceholderClass).html(titlePlaceholderText);
        });
    };

    Build.prototype.onAdderClick = function(e){
        var block = getBlock({
            type: $(e.target).data('type'),
            el: $('.js-blocks', this.$el)
        });

        this.add(block);
        block.once('block.contenteditable.watch', function(){
            block.focus();
        });
    };
};
