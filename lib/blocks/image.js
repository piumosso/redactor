define('redactor/blocks/image', [
    'redactor/core/AbstractBlock',
    'redactor/core/blockGetter',
    'redactor/config'
], function(AbstractBlock, getBlock, config){
    return AbstractBlock.extend({
        defaults: {
            src: '',
            caption: ''
        }
    }, {
        initializePlupload: function(){
            this.once('dom-insert', this.bindPlupload, this);
        },

        bindPlupload: function(){
            var that = this,
                $placeholder;

            if (this.model.get('src')) {
                return;
            }
            $placeholder = $('.js-placeholder', this.el);

            this.uploader = new plupload.Uploader({
                runtimes: 'html5',
                browse_button: $('.js-upload', this.el)[0],
                url: config.getOption('imageUploadUrl')
            });
            this.uploader.init();
            this.uploader.bind('FilesAdded', function(uploader, files){
                // Cвязываем каждый файл с блоком
                _.each(files, function(file, index){
                    var newBlock;

                    if (index == 0) {
                        file.block = that;
                    } else {
                        newBlock = getBlock({
                            type: 'image',
                            el: $('.js-blocks', that.getBuild().$el)
                        });
                        newBlock.insertAfter(files[index - 1].block);
                        file.block = newBlock;
                    }
                });
                uploader.start();
            });
            this.uploader.bind('BeforeUpload', function(){
                $placeholder.html('');
            });
            this.uploader.bind('UploadProgress', function(up, file) {
                $('.js-placeholder', file.block.el).html(file.percent + '%');
            });
            this.uploader.bind('Error', function(up, error) {
                console.warn(error);
            });
            this.uploader.bind('FileUploaded', function(uploader, file, info){
                $('.js-placeholder', file.block.el).remove();
                file.block.model.set(JSON.parse(info.response));
                file.block.render();
            });
        },

        focus: function(){}
    });
});
