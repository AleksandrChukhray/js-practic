const Set = require('./set').Set;

function SingletonSet(member){
    this.member = member; // Сохранить единственный элемент множества
}
  
SingletonSet.prototype = lib.inherit(Set.prototype);

// Далее добавляются свойства в прототип.
// Эти свойства переопределяют одноименные свойства объекта Set.prototype
lib.extend(SingletonSet.prototype, {
    // установить свойство constructor
    constructor: SingletonSet,
    // Данное множество доступно только для чтения: методы add() и remove()
    // возбуждают исключение
    add: function() {throw "множество доступно только для чтения"},
    remove: function() {throw "множество доступно только для чтения"},
    // Экземпляры SingletonSet всегда имеют размер, равный 1
    size: function(){ return 1; },
    // Достаточно вызывать функцию один раз и передать ей единственный элемент.
    foreach: function(f, context) { f.call(context, this.member); },
    // Метод contains() стал проще: такая реализация пригодна 
    // только для множества с единственным элементом.
    contains: function(x) { return x === this.member; }
});

module.exports = {
    SingletonSet
}