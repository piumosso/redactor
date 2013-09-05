# Конфигурация

Для конфигурации редактора нужно перед его инициализацией прописать настройки. Вот как это делается:
```javascript
Redactor.config({
    // ...
});
```
Чтобы получить настройку во время работы редактора, надо написать:
```javascript
Redactor.getOption('foo');
// или
Redactor.getOption('foo', 'bar');
```


## Стандартные опции


### blocks

Переопределение параметров [встроенных блоков](blocks/README.md) или [кастомные блоки](blocks/CREATE.md).
```javascript
Redactor.config({
    blocks: {
        mySuperBlock: {
            // ...
        },
        image: {
            uploadUrl: '...'
        }
    }
});
```


### buildTypes

Объект, описывающий все возможные типы сборок.
Его ключи — имена типов, а значения — объекты описания.
```javascript
Redactor.config({
    buildTypes: {
        post: {
            name: 'пост',
            blocks: ['text', 'image']
        }
    }
});
```
В этих объектах указываются:

- **name** — человеческое название типа сборки
- **blocks** — массив названий блоков, которые разрешены в этой сборке


### templateEngine

Шаблонный движок. По умолчанию используется Django-совместимый
[Plate.js](https://github.com/chrisdickinson/plate/) ('redactor/templates/Plate').
```javascript
Redactor.config({
    templateEngine: 'redactor/templates/MyTemplate'
});
```


### editable

Имя модуля с классом для редактирования. По умолчанию простое редактирование через contenteditable
('redactor/editable/ContentEditable'). Подробнее про [редактирование контента](editable/README.md).
```javascript
Redactor.config({
    editable: 'redactor/editable/ContentEditable'
});
```
