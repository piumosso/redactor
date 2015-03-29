function getBuild () {
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
        content: '1vmhbfd lsk hgfliehsu gilrehjs xvbdfhjxg fiw4jvbdfx;ivo htw4;iuvg dfiuhx viuth4w oi bjfspdilhbv ;twhv 1vmhbfd lsk hgfliehsu gilrehjs xvbdfhjxg fiw4jvbdfx;ivo htw4;iuvg dfiuhx viuth4w oi bjfspdilhbv ;twhv ',
        status: 'ACTIVE'
      },
      {
        type: 'text',
        content: '22i8y6uoeuyo8uey96yit9ruyo695uyotuboy8u6neby856 y89u6 8hu 8hut8rduh gdfh9gfdh0gfd-9h gf9 hg9h0gf22i8y6uoeuyo8uey96yit9ruyo695uyotuboy8u6neby856 y89u6 8hu 8hut8rduh gdfh9gfdh0gfd-9h gf9 hg9h0gf22i8y6uoeuyo8uey96yit9ruyo695uyotuboy8u6neby856 y89u6 8hu 8hut8rduh gdfh9gfdh0gfd-9h gf9 hg9h0gf22i8y6uoeuyo8uey96yit9ruyo695uyotuboy8u6neby856 y89u6 8hu 8hut8rduh gdfh9gfdh0gfd-9h gf9 hg9h0gf',
        status: 'ACTIVE'
      },
      {
        type: 'text',
        content: '333blgfjd otu reoihjdgrlkjbnfgd;ob utwi;bj n;lkgfj sbiogjrs]pob kr]powg bit[j b]gei b9-]geir b0-twi bt[kw bgkr w[brk 333blgfjd otu reoihjdgrlkjbnfgd;ob utwi;bj n;lkgfj sbiogjrs]pob kr]powg bit[j b]gei b9-]geir b0-twi bt[kw bgkr w[brk 333blgfjd otu reoihjdgrlkjbnfgd;ob utwi;bj n;lkgfj sbiogjrs]pob kr]powg bit[j b]gei b9-]geir b0-twi bt[kw bgkr w[brk 333blgfjd otu reoihjdgrlkjbnfgd;ob utwi;bj n;lkgfj sbiogjrs]pob kr]powg bit[j b]gei b9-]geir b0-twi bt[kw bgkr w[brk 333blgfjd otu reoihjdgrlkjbnfgd;ob utwi;bj n;lkgfj sbiogjrs]pob kr]powg bit[j b]gei b9-]geir b0-twi bt[kw bgkr w[brk 333blgfjd otu reoihjdgrlkjbnfgd;ob utwi;bj n;lkgfj sbiogjrs]pob kr]powg bit[j b]gei b9-]geir b0-twi bt[kw bgkr w[brk 333blgfjd otu reoihjdgrlkjbnfgd;ob utwi;bj n;lkgfj sbiogjrs]pob kr]powg bit[j b]gei b9-]geir b0-twi bt[kw bgkr w[brk 333blgfjd otu reoihjdgrlkjbnfgd;ob utwi;bj n;lkgfj sbiogjrs]pob kr]powg bit[j b]gei b9-]geir b0-twi bt[kw bgkr w[brk 333blgfjd otu reoihjdgrlkjbnfgd;ob utwi;bj n;lkgfj sbiogjrs]pob kr]powg bit[j b]gei b9-]geir b0-twi bt[kw bgkr w[brk 333blgfjd otu reoihjdgrlkjbnfgd;ob utwi;bj n;lkgfj sbiogjrs]pob kr]powg bit[j b]gei b9-]geir b0-twi bt[kw bgkr w[brk ',
        status: 'ACTIVE'
      }
    ]
  });
}


var build = getBuild().attach(document.getElementById('example1'));
