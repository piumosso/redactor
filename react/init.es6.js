function getBuild () {
  var redactor = new Redactor();
  var BaseBlock = redactor.getBaseBlock();
  var BaseBuild = redactor.getBaseBuild();

  var ContentEditable = React.createClass({
    displayName: 'ContentEditable',
    render() {
      return React.createElement('div', {
        onInput: this.emitChange,
        onBlur: this.emitChange,
        contentEditable: true,
        dangerouslySetInnerHTML: {__html: this.props.html}
      });
    },
    shouldComponentUpdate(nextProps) {
      return nextProps.html !== this.getDOMNode().innerHTML;
    },
    emitChange() {
      var html = this.getDOMNode().innerHTML;
      if (this.props.onChange && html !== this.lastHtml) {

        this.props.onChange({
          target: {
            value: html
          }
        });
      }
      this.lastHtml = html;
    }
  });


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

    static get formComponent() {
      return React.createClass({
        getInitialState: function() {
          return this.props.model;
        },
        onChange: function(e) {
          this.props.model.content = e.target.value;
          this.setState({content: e.target.value});
        },
        render() {
          return React.createElement(ContentEditable, {html: this.state.content, onChange: this.onChange});
        }
      });
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
