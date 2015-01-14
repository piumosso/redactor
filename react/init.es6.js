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

    get formComponent() {
      var block = this;

      return React.createClass({
        getInitialState: function() {
          return block.model;
        },
        onChange: function(e) {
          block.model.content = e.target.value;
          this.setState({content: e.target.value});
        },
        render() {
          return React.createElement('input', {onChange: this.onChange, value: block.model.content});
        }
      });
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

build.attach(document.getElementById('redactor'));

document.getElementsByClassName('js-print')[0].onclick = function () {
  build.print().then(function (html) {
    console.info(html);
  })
};