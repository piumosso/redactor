# Core-API редактора


## Build - сборка


### Создание сборки:

```javascript
var build = new Redactor.Build({
    type: 'post'
});
```

### Методы:

**getType** - получение типа сборки:
```javascript
var type = build.getType();
```
**reset** - заполнение сборки блоками
```javascript
build.reset([
    {type: 'text', content: 'Cтарая дева'},
    {type: 'text', content: 'Печальный памятник'},
    {type: 'text', content: 'Незбывшимся мечтам'}
]);
```
**add** - добавление в сборку блока в конец или на заданную позицию
```javascript
build.add(block);
// или
build.add(block, 7);
```
**canReceive** - проерка, может ли билд принимать блоки определённого типа
```javascript
var isAllowed = build.canReceive('text');
```


## Block - блок


### Создание блока:

```javascript
var block = new Redactor.blocks.text({
    content: 'Текст'
});
```


### Методы:

**getType** - получение типа блока:
```javascript
var type = build.getType();
```


## blockGetter - получение объекта блока из данных

```javascript
require('redactor/core/blockGetter', function(getBlock){
    var block = getBlock({type: 'text', content: 'Cтарая дева'});
});
```
