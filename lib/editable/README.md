# Редактрование текста

Для редактирования текста применяются специальные объекты, которые инициализируют wysiwyg и следят за изменением текста.


## Со стороны шаблона блока

Чтобы в шаблоне блока указать редактируемый текст, напишите:
```html
<div class="redactor-editable js-redactor-editable" 
     data-field="content" 
     data-placeholder="Введите текст">{{ content }}</div>
```
Здесь класс data-field содержит имя поля, которое редактируется в этом div, data-placeholder - текст,
отображаемый, когда поле пустое.


## Настройки

```javascript
Redactor.config({
    editable: 'redactor/editable/MyEditable'
});
```


## Как делать свои редакторы

```javascript
define('redactor/editable/MyEditable', [
    'redactor/editable/AbstractEditable'
], function(AbstractEditable){
    return AbstractEditable.extend({
        // Инициализация wysiwyg
        init: function(){
            // Доступен this.$el
        },

        // Слежение за изменением введённого текста
        watch: function(){
            // this.store(newValue)
        }
    });
});
```


## Редакторы «из коробки»
