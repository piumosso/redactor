# Создание нового типа блоков редактора

Чтобы создать новый тип блоков, надо создать модуль `redactor/blocks/MyBlock`, который будет выозвращать результат
выполенения метода `extend` базового типа блоков `redactor/core/Block`:
```javascript
define('redactor/blocks/MyBlock', [
    'redactor/core/AbstractBlock'
], function(AbstractBlock){
    return AbstractBlock.extend({
        defaults: {
            myField: ''
        }
    });
});
```

Первый параметр `extend` — дополнительные методы и свойства модели блока, например, `defaults` — свойство,
описывающее значащие поля модели (остальные обязательные будут добавлены автоматически).
