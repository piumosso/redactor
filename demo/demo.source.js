function getBuild () {
  var redactor = new Redactor();
  var BaseBlock = redactor.getBaseBlock();
  var BaseBuild = redactor.getBaseBuild();
  var React = Redactor.React;

  class TextBlock extends BaseBlock {
    get type() {
      return 'text';
    }

    static getPrintTemplate() {
      return <p>{this.props.content}</p>;
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

  class HeaderBlock extends BaseBlock {
    get type() {
      return 'header';
    }

    static getPrintTemplate() {
      return <h2>{this.props.content}</h2>;
    }

    static get form() {
      return {
        render() {
          return <h2>
            <Redactor.components.ContentEditable model={this.props.model} property="content" />
          </h2>;
        }
      };
    }
  }

  // FIXME
  class ListBlock extends BaseBlock {
    get type() {
      return 'list';
    }

    static getPrintTemplate() {
      return <ul>
        {
          this.props.items.map((itemText, index) => {
            return <li key={index}>{itemText}</li>
          })
        }
      </ul>;
    }

    static get form() {
      return {
        render() {
          return <ul>
            {
              this.props.model.items.map((itemText, index) => {
                return <li key={index}><Redactor.components.ContentEditable model={this.props.model.items} property={index} /></li>
              })
            }
          </ul>;
        }
      };
    }
  }

  class PostBuild extends BaseBuild {
    get type() {
      return 'post';
    }

    get blockTypes() {
      return ['text', 'header', 'list'];
    }
  }

  redactor.addBlock(TextBlock);
  redactor.addBlock(HeaderBlock);
  redactor.addBlock(ListBlock);
  redactor.addBuild(PostBuild);

  return redactor.load({
    type: 'post',
    blocks: [
      {
        type: 'header',
        content: 'Простой пример',
        status: 'ACTIVE'
      },
      {
        type: 'text',
        content: 'Redactor.js — фреймворк, с помощью которого можно постоить форму редактирования материалов для вашего сайта. Материал строится из блоков, стандартных и определяемых вами.',
        status: 'ACTIVE'
      },
      {
        type: 'text',
        content: 'Что можно сделать с помощью этого фреймворка?',
        status: 'ACTIVE'
      },
      {
        type: 'text',
        content: 'Под капотом Redactor.js приложение React, код на EcmaScript 6, покрытый тестами на mocha, собираемый c помощью Gulp.',
        status: 'ACTIVE'
      }
    ]
  });
}


var build = getBuild().attach(document.getElementById('example1'));
