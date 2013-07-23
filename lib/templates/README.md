# Шаблонизаторы

Шаблонизатор — это класс со следующим API:
```javascript
require(['redactor/templates/Plate'], function(Template){
    var tmpl = new Template('Hello, {{ name }}!');

    tmpl.render({name: 'world'}, function(html){
        // html == 'Hello, world!'
    });
});
```
