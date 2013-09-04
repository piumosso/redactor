# Создание нового типа блоков редактора


## Конфигурация

Обязательные параметры блока:
```javascript
Redactor.config({
    blocks: {
        mySuperBlock: {
            verboseName: 'My SUPER block!' // Человеческое название блока
        }
    }
});
```


## Размещение логики

Чтобы создать новый тип блоков, надо создать модуль `redactor/blocks/MyBlock`, который будет возвращать результат
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
