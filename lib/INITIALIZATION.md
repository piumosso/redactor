# Инициализация редактора

Метод Redactor.initialize ответственный за инициализацию:
- типов (классов) блоков,
- шаблонизатора.

Redactor.initialize автоматически вызывается при вызове метода [Redactor.load](USAGE.md)
```javascript
Redactor.initialize(function(){
    // ...
});
```
