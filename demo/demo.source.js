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

    static get form() {
      return {
        render() {
          return <Redactor.components.ContentEditable model={this.props.model} property="content" />;
        }
      };
    }
  }

  class PostBuild extends BaseBuild {
    get type() {
      return 'post';
    }

    get blockTypes() {
      return ['text'];
    }

    get printTemplateString() {
      return 'section!= blocksHtml';
    }

    get printTemplateStringRss() {
      return '!= blocksHtml';
    }
  }

  redactor.addBlock(TextBlock);
  redactor.addBuild(PostBuild);

  return redactor.load({
    type: 'post',
    blocks: [{
      type: 'text',
      content: '1',
      status: 'ACTIVE'
    }, {
      type: 'text',
      content: '22',
      status: 'ACTIVE'
    }, {
      type: 'text',
      content: '333',
      status: 'ACTIVE'
    }]
  });
}


var build = getBuild().attach(document.getElementById('redactor'));


setInterval(function () {
  build.print().then(function (html) {
    document.getElementById('result').innerHTML = html;
  })
}, 1000);
