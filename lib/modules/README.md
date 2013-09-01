# Модули редактора

Модуль редактора модифицирует ядровые сущности, добавляя к ним функциональность.
```javascript
define('redactor/modules/myModule', [
    'redactor/core/Build',
    'redactor/core/AbstractBlock'
], function(Build, AbstractBlock){
    return function(){
        // Действия по инициализации модуля
    };
});

```
