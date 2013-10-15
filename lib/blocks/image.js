define('redactor/blocks/image', [
    'redactor/core/AbstractBlock',
    'redactor/config'
], function(AbstractBlock, config){
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
            this.uploader.bind('FilesAdded', function(uploader){
                uploader.start();
            });
            this.uploader.bind('BeforeUpload', function(){
                $placeholder.html('');
            });
            this.uploader.bind('UploadProgress', function(up, file) {
                $placeholder.html(file.percent + '%');
            });
            this.uploader.bind('Error', function(up, error) {
                console.warn(error);
            });
            this.uploader.bind('FileUploaded', function(uploader, file, info){
                $placeholder.remove();
                that.model.set(JSON.parse(info.response));
                that.render();
            });
        },

        focus: function(){}
    });
});
