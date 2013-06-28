# Инициализация сборки редактора

Чтобы создать сборку, надо скормить ей данные.

При ручном конструировании данных (когда [sync](CONFIGURATION.md#sync) установлен в `false`) используй метод `Redactor.make`,
который принимает данные сборки.
```javascript
var build = Redactor.make(data);
```

## Формат данных

```javascript
var data = {
    // Тип сборки
    type: 'post',

    // Массив блоков
    blocks: [
        {type: 'text', content: 'Hello, world!'}
    ]
}
```
