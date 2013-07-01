# Инициализация сборки редактора

Чтобы создать сборку, надо скормить ей данные, используя метод `Redactor.load`.
При ручном конструировании данных (когда [sync](CONFIGURATION.md#sync) установлен в `false`) данные требуется передать явно.
```javascript
var build = Redactor.load(data);
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
