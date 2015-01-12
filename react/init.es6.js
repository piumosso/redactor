function getBuild () {
  var redactor = new Redactor();
  var BaseBlock = redactor.getBaseBlock();
  var BaseBuild = redactor.getBaseBuild();


  class TextBlock extends BaseBlock {
    get type() {
      return 'text';
    }

    get printTemplateString() {
      return 'p= content';
    }

    get printTemplateStringRss() {
      return '=content\nbr';
    }
  }

  class ImageBlock extends BaseBlock {
    get type() {
      return 'image';
    }

    get printTemplateString() {
      return 'img(src=source)';
    }

    get printTemplateString() {
      return '!= innerBuildHtml';
    }
  }

  class PostBuild extends BaseBuild {
    get type() {
      return 'post';
    }

    get blockTypes() {
      return ['text', 'gallery'];
    }

    get printTemplateString() {
      return 'section!= blocksHtml';
    }

    get printTemplateStringRss() {
      return '!= blocksHtml';
    }
  }

  redactor.addBlock(TextBlock);
  redactor.addBlock(ImageBlock);
  redactor.addBuild(PostBuild);

  return redactor.load({
    type: 'post',
    blocks: [{
      type: 'text',
      content: '123',
      status: 'ACTIVE'
    }, {
      type: 'text',
      content: '456',
      status: 'INACTIVE'
    }, {
      type: 'text',
      content: '789',
      status: 'ACTIVE'
    }]
  });
}


var build = getBuild();

build.show(document.getElementById('redactor'));