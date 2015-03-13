function getBuild () {
  var redactor = new Redactor();
  var BaseBlock = redactor.getBaseBlock();
  var BaseBuild = redactor.getBaseBuild();


  class TextBlock extends BaseBlock {
    get type() {
      return 'text';
    }

    static get form() {
      return {
        render() {
          return <p>
            <Redactor.components.ContentEditable model={this.props.model} property="content" />
          </p>;
        }
      };
    }
  }

  class ListBlock extends BaseBlock {
    get type() {
      return 'list';
    }

    static get form() {
      return {
        render() {
          return <ul>{
            this.props.model.items.map(function(item, key) {
              <li key={key}>
                <Redactor.components.ContentEditable model={this.props.items} property={key} />
              </li>
            })
          }</ul>;
        }
      };
    }
  }

  class PostBuild extends BaseBuild {
    get type() {
      return 'post';
    }

    get blockTypes() {
      return ['text', 'list'];
    }
  }

  redactor.addBlock(TextBlock);
  redactor.addBlock(ListBlock);
  redactor.addBuild(PostBuild);

  return redactor.load({
    type: 'post',
    blocks: [{
      type: 'text',
      content: 'Redactor.js — фреймворк, с помощью которого можно постоить форму редактирования материалов для вашего сайта. Материал строится из блоков, стандартных и определяемых вами.',
      status: 'ACTIVE'
    }, {
      type: 'text',
      content: 'Что можно сделать с помощью этого фреймворка?',
      status: 'ACTIVE'
    }, {
    }, {
      type: 'list',
      items: [
        'Определить, как выглядит блок при редактировании', 'определить его отображение при «печати»', 'определить разные отображения при печати', 'описать логику ограничения использования блоков.'
      ],
      status: 'ACTIVE'
    }, {
      type: 'text',
      content: 'Под капотом Redactor.js приложение React, код на EcmaScript 6, покрытый тестами на mocha, собираемый c помощью Gulp.',
      status: 'ACTIVE'
    }]
  });
}


var build = getBuild().attach(document.getElementById('example1'));