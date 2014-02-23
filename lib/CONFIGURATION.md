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
[Jade.js](https://github.com/chrisdickinson/plate/) ('redactor/templates/Plate').
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


### modules

Массив с именами модулей, которые нужно задействовать в редакторе (инициализируются с сохранением порядка).
```javascript
Redactor.config({
    modules: ['sort', 'adder']
});
```


### defaultBuildTemplate

Строка с текстом шаблона сборки.
```javascript
Redactor.config({
    defaultBuildTemplate: '...'
});
```


### defaultBuildTemplateSource

Строка с источником (адресом) шаблона сборки.
```javascript
Redactor.config({
    defaultBuildTemplateSource: 'redactor/templates/build.html'  // Значение по умолчанию
});
```


### defaultBuildPrintTemplate

Строка с текстом шаблона для печати сборки.
```javascript
Redactor.config({
    defaultBuildPrintTemplate: '...'
});
```


### defaultBuildPrintTemplateSource

Строка с источником (адресом) шаблона для печати сборки.
```javascript
Redactor.config({
    defaultBuildPrintTemplateSource: 'redactor/templates/build.print.html'  // Значение по умолчанию
});
```


### baseBlockTemplateSource

Базовый шаблон для блока. Задаёт обёртку формы блока и содержит дополнительную разметку для всех блоков,
необходимую, например, для работы плагинов.
```javascript
Redactor.config({
    baseBlockTemplateSource:'redactor/templates/block.html'  // Значение по умолчанию
});
```
