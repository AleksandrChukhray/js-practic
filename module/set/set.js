const lib = require('./../lib');

function Set(){ // Это конструктор
    this.values = {}; // Свойства этого объекта составляют множество
    this.n = 0; // Количество значений в множестве
    this.add.apply(this, arguments); // Все аргументы являются значениями, добавляемыми в множество
  }
  
  // Добавляет все аргументы в множество
  Set.prototype.add = function(){
    for(var i=0; i < arguments.length; i++){
      var val = arguments[i];
      var str = Set._v2s(val);
  
      if(!this.values.hasOwnProperty(str)){
        this.values[str] = val;
        this.n++;
      }
    }
    return this;
  };
  
  // Удаляет все аргументы из множества
  Set.prototype.remove = function(){
    for(var i=0; i < arguments.length; i++){
      var val = arguments[i];
      var str = Set._v2s(val);
  
      if(this.values.hasOwnProperty(str)){
        delete this.values[str];
        this.n--;
      }
    }
  
    return this;
  };
  
  // Возвращает true, если множество содержит value; иначе возвращает false;
  Set.prototype.contain = function(value){
    return this.values.hasOwnProperty(Set._v2s(value));
  };
  
  // Возвращает размер множества.
  Set.prototype.size = function(){ return this.n; };
  
  // Вызывает функцию f в указанном контесте для каждого элемента множества.
  Set.prototype.foreach = function(f, context){
    for(var s in this.values)
      if(this.values.hasOwnProperty(s))
        f.call(context, this.values[s])
  };
  
  // Функция для внутреннего использования. Отображает любые значения JS в уникальные строки.
  Set._v2s = function(val){
    switch(val){
      case undefined: return 'u'; // Специальные простые значения
      case null: return 'n';
      case true: return 't';
      case false: return 'f';
      default: switch (typeof val){
        case 'number': return '#' + val; // числа получают префикс #
        case 'string': return '"' + val; // строки получают префикс "
        default: return '@' + ObjectId(val); // Объекты и функции - @
      }
    }
  };
  
  // Фабричная функция
  Set.fromArray = function(a){
    s = new Set();
    s.add.apply(s, a);
  
    return s;
  };
  
  function ObjectId(o){
    var prop = "|**objectid**|";
  
    if (!o.hasOwnProperty(prop))
      o[prop] = Set._v2s.next++;
    return o[prop];
  }
  
  Set._v2s.next = 100; // Начальное значение для идентификаторов объектов.
  
  // Добавить новые методы в объект-прототип класса Set
  lib.extend(Set.prototype, {
    // Преобразовать множество в строку
    toString: function(){
      var s = "{", i = 0;
  
      this.foreach(function(v){ s+=((i++ > 0) ? ", ": "") + v});
      return s + "}";
    },
    // Действует так же, как toString, но вызывает toLocaleString для всех значений
    toLocaleString: function(){
      var s = "{", i = 0;
  
      this.foreach(function(v){
        if(i++ > 0) s+= ", ";
        if(v == null) s+=v; // null и undefined
        else s+= v.toLocaleString(); // остальные
      });
  
      return s+"}";
    },
    // Преобразует множество в массив значений
    toArray: function(){
      var a = [];
  
      this.foreach(function(v){ a.push(v); });
      return a;
    }
  });
  
  Set.prototype.toJSON = Set.prototype.toArray;
  
  Set.prototype.equals = function(that){
    // Сокращенная проверка для тривиального случая
    if(this === that) return true;
  
    // Если объект that не является множеством, он не может быть равен объекту this.
    // Для поддержки подклассов класса Set используется оператор instanceof.
    // Мы могли бы реализовать более либеральную проверку, если бы для нас
    // было желательно использовать прием грубого определения типа.
    // Точно так же можно было бы ужесточить проверку, выполняя сравнение
    // this.constructor == that.constructor.
    // Обратите внимание, что оператор instanceof корректно отвергает попытки
    // сравнения со значениями null и undefined
    if(!(that instanceof Set)) return false;
  
    // Если два множества имеют разные размеры, они не равны
    if(this.size() !== that.size()) return false;
  
    // Теперь требуется убедиться, что каждый элемент в this также присутствует в that.
    // Использовать исключение для прерывания цикла foreach, если множества не равны.
    try {
      this.foreach(function(v) { if (!that.contains(v)) throw false; });
      return true;   // Все элементы совпали: множества равны.
    } catch (x) {
      if (x === false) return false; // Элемент в this отсутствует в that.
      throw x;       // Для других исключений: возбудить повторно.
    }
  };

  module.exports = {
    Set
  }