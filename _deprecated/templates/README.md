# Шаблонизаторы

Шаблонизатор — это класс со следующим API:
```javascript
var tmpl = new Redactor.Template('Hello, {{ name }}!');

tmpl.render({name: 'world'}, function(html){
    // html == 'Hello, world!'
});
```
