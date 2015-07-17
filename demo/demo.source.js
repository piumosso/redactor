(function() {
  var redactor = new Redactor();
  var BaseBlock = redactor.getBaseBlock();
  var BaseBuild = redactor.getBaseBuild();
  var React = Redactor.React;

  class TextBlock extends BaseBlock {
    get type() {
      return 'text';
    }

    get defaults() {
      return {
        content: ''
      };
    }

    static get title() {
      return 'Текст';
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

    get defaults() {
      return {
        content: ''
      };
    }

    static get title() {
      return 'Заголовок';
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

    get defaults() {
      return {
        items: ['']
      };
    }

    static get title() {
      return 'Список';
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

  redactor.load({
    type: 'post',
    blocks: [
      {
        type: 'header',
        content: 'Концепция редактора',
        status: 'ACTIVE'
      },
      {
        type: 'text',
        content: 'Редактор принимает конфигурацию материала, отображает соответствующую ему форму. Материал можно напечатать, причём в разных контекстах. При конфигурировании редактора в него добавляются блоки и сборки.',
        status: 'ACTIVE'
      },
      {
        type: 'text',
        content: 'Редактор - это базовая сущность, с помощью которой можно настроить, например, шаблонный движок для печати. Редактор знает, какие блоки и сборки доступны в нём.',
        status: 'ACTIVE'
      },
      {
        type: 'text',
        content: 'Блок — единица данных. Имеет свою какую-то модель, которая редактируется в форме, а также имеет какое-то представление «на печати». Допустимы блоки, которые содержат в себе сборки, тем самым реализуя вложенные редакторы.',
        status: 'ACTIVE'
      },
      {
        type: 'text',
        content: 'Сборка — последовательность блоков. Как и блок, может иметь свои данные и форму для их редактирования.',
        status: 'ACTIVE'
      },
      {
        type: 'text',
        content: 'Сборки, как и блоки, являются классами, их можно наследовать друг от друга. Сборка знает, какие блоки допустимо использовать в ней.',
        status: 'ACTIVE'
      }
    ]
  }).attach(document.getElementById('example-entities'));

  redactor.load({
    type: 'post',
    blocks: [
      {
        type: 'text',
        content: 'Как говорилось ранее, блок может содержать в себе вложенную сборку. Для вложенных сборок можно настраивать свой набор допустимых блоков. В качестве примера предлагаю разобраться, как готовить тирамису:',
        status: 'ACTIVE'
      }
    ]
  }).attach(document.getElementById('example-inner-builds'));

  redactor.load({
    type: 'post',
    blocks: [
      {
        type: 'text',
        content: 'С помощью редактора можно описать формы редактивания необычных предметов, в основе которых лежит иерархическая структура данных',
        status: 'ACTIVE'
      }
    ]
  }).attach(document.getElementById('example-custom'));

  redactor.load({
    type: 'post',
    blocks: [
      {
        type: 'text',
        content: 'WYSIWYG’и экономят время пользователя и сокращают число ошибок. К сожалению, они малопригодны для редактировния структурированного контента. Все, что у них (и у нас) есть - это HTML, который мы можем распарсить для своих задач. Редактор пытается решить эту проблему. Вы видите то, что хотите получить, структура данных сохранена. В основе концепции редактора набор материалов из блоков. Редактор не является конечным решением, а предоставляет инструменты для декларации блоков и различных правил их поведения. Таким образом, редактор - это Фреймворк для построения над-WYSIWYG’ов.',
        status: 'ACTIVE'
      }
    ]
  }).attach(document.getElementById('example-intro'));

  redactor.load({
    type: 'post',
    blocks: [
      {
        type: 'text',
        content: 'Когда материал набран, его можно отдать в печать. С точки зрения редактора печать — это преобразование сборки в HTML. Напечатанный блок не обязательно должен выглядеть так же, как и в форме (хотя, раз это WYSIWYG, это желательно :-)). Более того, можно предусмотреть разные шаблоны в зависимости от того, как этот материал будет использоваться. Например, он может выглядеть по-разному для десктопной, мобильной версий и рсс.',
        status: 'ACTIVE'
      },
      {
        type: 'text',
        content: 'Для этого при печати указывается контекст печати, вот так: <пример кода>',
        status: 'ACTIVE'
      }
    ]
  }).attach(document.getElementById('example-print'));
})();