require('../../extentions/function');

const SingletonSet = require('../set/singleton-set').SingletonSet;

// Вспомогательная функция, которая может использоваться для определения
// любого абстрактного метода
function abstractmethod(){
    throw new Error("Абстрактный метод");
}

/**
 * Класс AbstractSet определяет единственный абстрактный метод, contains()
 */
function AbstractSet(){
    throw new Error("Нельзя создавать экземпляр абстрактного класса");
}

AbstractSet.prototype.contains = abstractmethod;

/**
 * NotSet - конкретный подкласс класса AbstractSet.
 * Элементами этого множества являются все значения, которые не являются
 * элементами некоторого другого множества. Поскольку это множество определяется в терминах 
 * другого множества, оно не доступно для записи, а так как оно имеет бесконечное число элементов,
 * оно недоступно для перечисления. Все, что позволяет этот класс, - это проверить принадлежность к
 * множеству. Обратите внимание, что для определения этого подкласса используется метод
 * Function.prototype.extend(), объявленный выше.
 */

 var NotSet = AbstractSet.extend(
     function NotSet(set){ this.set = set; },
     {
         contains: function(x){ return !this.set.contains(x); },
         toString: function(x){ return "''" + this.set.toString(); },
         equals: function(that){
             return that instanceof NotSet && this.set.equals(that.set);
         }
     },
 )

 /**
  * AbstractEnumerableSet - абстрактный подкласс класса AbstractSet.
  * Определяет абстрактные методы size() и foreach() и реализует конкретные
  * методы isEmpty(), toArray(), to[Locale]String() и equals().
  * Подклассы, реализующие методы contains(), size() и foreach(),
  * получают эти пять конкретных методов даром.
  */
 var AbstractEnumerableSet = AbstractSet.extend(
     function(){
         throw new Error("Нельзя создавать экземпляр абстрактного класса");
     },
     {
         size: abstractmethod,
         foreach: abstractmethod,
         isEmpty: function() {return this.size() == 0; },
         toString: function() {
             var s = "{", i = 0;
             this.foreach(function(v){
                 if(i++ > 0) s += ", ";
                 s += v;
             })

             return s + "}";
         },
         toLocaleString: function(){
             var s = "{", i = 0;
             this.foreach(function(v){
                if(i++ > 0) s+= ", ";
                if(v == null) s += v; //null and undefined
                else s += v.toLocaleString();
             });

             return s + "}";
         },
         toArray: function(){
            var a = [];
            this.foreach(function(v){ a.push(v); });
            return a;
         },
         equals: function(that){
             if(!(that instanceof AbstractEnumerableSet)) return false;
             // Если множество that имеет другой размер, множества не равны
            if(this.size() != that.size()) return false;
            // Проверить наличие каждого элемента this в множестве that.
            try{
                this.foreach(function(v){
                    if(!that.contains(v)) throw false;
                })
            } catch (x){
                if(x === false ) return false; // Множества не равны
                    throw x; // Повторно возбудить любое иное возникшее исключение.
            }
        }
     }
 )

 /**
  * SingletonSet - конкретный подкласс класса AbstractEnumerableSet.
  * Множество из единственного элемента, доступное только для чтения.
  */
var SingletonSet = AbstractEnumerableSet.extend(
    function SingletonSet(member) { this.member = member; },
    {
        contains: function(x){ return x === this.member; },
        size: function() { return 1; },
        foreach: function(f, ctx) { f.call(ctx, this.member); }
    }
);

/**
 * AbstractWritableSet - абстрактный подкласс класса AbstractEnumerableSet.
 * Oпределяет абстрактные методы add() и remove() и реализует конкретные
 * методы union(), intersection() и difference().
 */
var AbstractWritableSet = AbstractEnumerableSet.extend(
    function(){
        throw new Error("Нельзя создать экземпляр абстрактного класса");
    },
    {
        add: abstractmethod,
        remove: abstractmethod,
        union: function(that){
            var self = this;
            that.foreach(function(v){ self.add(v) });
            return this;
        },
        intersection: function(that){
            var self = this;
            this.foreach(function(v){ if(!that.contains(v)) self.remove(v); });
            return this;
        },
        difference: function(that){
            var self = this;
            that.foreach(function(v){ self.remove(v); });
            return this;
        }
    }
)

/**
 * ArraySet - конкретный подкласс класса AbstractWritableSet.
 * Представляет множество элементов как массив значений и реализует линейный поиск
 * в массиве в своем методе contains(). Поскольку алгоритм метода contains()
 * имеет сложность О(n) вместо О(1), данный класс следует испльзовать только
 * для создания относительно небольших множеств.
 * Обратите внимание, что эта реализация опирается на методы класса Array
 * indexOf() и forEach(), которое определяются стандартом ES5.
 */
var ArraySet = AbstractWritableSet.extend(
    function ArraySet(){ 
        this.values = [];
        this.add.apply(this, arguments);
    },
    {
        contains: function(v){ return this.values.indexOf(v) != -1; },
        size: function(){ return this.values.length; },
        foreach: function(f, c){ this.values.forEach(f, c); },
        add: function(){
            
            for(var i = 0; i < arguments.length; i++){
                var arg = arguments[i];
                if(!this.contains(arg)) this.values.push(arg);
            }

            return this;
        },
        remove: function() {
            for(var i = 0; i < arguments.length; i++){
                var p = this.values.indexOf(arguments[i]);
                if(p == -1) continue;
                this.values.splice(p, 1);
            }
            return this;
        }
    }
)

module.exports = {
    ArraySet,
    NotSet,
    AbstractWritableSet,
    SingletonSet,
    AbstractEnumerableSet
}