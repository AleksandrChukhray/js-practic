function inherit(p) {
    if(p == null) throw TypeError();
    // if(Object.create) return Object.create(p);
  
    let t = typeof p;
  
    if(t !== "object" && t !== "function") throw TypeError;
  
    function F() {
    };
    F.prototype = p;
  
    return new F();
  }
  
  /**
   * Копирует перечислимые свойства из объекта p в объект o и возвращает о.
   * Если о и р имеют свойства с одинаковыми именами, значение свойства в объекте
   * о затрагивается значением свойства из объекта р.
   * Эта функция не учитывает наличие методов доступа и не копирует атрибуты.
   */
  function extend(o, p) {
    for(prop in p) {
      o[prop] = p[prop];
    }
  
    return o;
  }
  
  /**
   * Копирует перечислимые свойства из объекта р в объект о и возвращает о.
   * Если о и р имеют свойства с одинаковыми именами, значение свойства в объекте
   * о остается неизменным. Эта функция не учитывает наличие методов доступа и не
   * копирует атрибуты.
   */
  function merge(o, p) {
    for(prop in p) {
      if(o.hasOwnProperty(prop)) continue;
      o[prop] = p[prop];
    }
    return o;
  }
  
  /**
   * Удаляет из объекта о свойства, отсутствующие в объект р.
   * Возвращает о.
   */
  function restrict(o, p) {
    for(prop in o) {
      if(!(prop in p)) delete o[prop];
    }
    return o
  }
  
  /**
   * Удаляет из объекта о свойства, присутствующие в объекте р. Возвращает о.
   */
  function subtract(o, p) {
    for(prop in p) {
      delete o[prop];
    }
    return o;
  }
  
  /**
   * Возвращает новый объект, содержащий свойства, присутствующие сразу в обоих
   * объектах, о и р. Результат чем-то напоминает пересечение о и р, но значение
   * свойств объекта р отбрасываются
   */
  function intersection(o, p) {
    return restrict(extend({}, o), p)
  }
  
  /**
   * Возвращает массив имен собственных перечислимых свойств объекта о.
   */
  function keys(o) {
    if(typeof o !== 'object') throw TypeError(); // Арг. должен быть объектом
    var result = [];
  
    for(var prop in o) {
      if(o.hasOwnProperty(prop)) {
        result.push(prop);
      }
    }
  
    return result;
  }
  
  function classof(o) {
    if(o === null) return 'null';
    if(o === undefined) return 'undefined';
    return Object.prototype.toString.call(o)//.slice(8, -1);
  }
  
  // Определяет, является ли o объектом, подобным массиву. Строки и функции имеют
  // числовое свойство length, но они исключаются проверкой typeof.
  // В клиентском JavaScript тексто­ые узлы DOM имеют числовое свойство length
  // и, возможно, должны быть исключены дополнительной проверкой o.nodeType != 3.
  function isArrayLike(o) {
    if(o &&                               // o не null, не undefined и т. д.
      typeof o === "object" &&           // o - объект
      isFinite(o.length) &&              // o.length - конечное число
      o.length >= 0 &&                   // o.length - положительное
      o.length === Math.floor(o.length) && // o.length - целое
      o.length < 4294967296)             // o.length < 2^32
      return true;                       // Значит, объект o подобен массиву
    else
      return false;                      // Иначе - нет
  }
  
  var isArray = Function.isArray || function(o) {
    return typeof o === "object" &&
      Object.prototype.toString.call(o) === "[object Array]";
  };
  
  function getPropertyNames(o, a) {
    a = a || [];
    for(var prop in o) a.push(prop);
  
    return a;
  }
  
  function numberOfArguments(x, y, z) {
    if(arguments.length !== 3) {
      throw new Error('функция f вызывана с ' + arguments.length + ' аргументами, а требуется 3');
    }
  }
  
  function max() {
    var m = Number.NEGATIVE_INFINITY;
  
    for(var i = 0; i < arguments.length; i++)
      if(arguments[i] > m) m = arguments[i];
  
    return m;
  }
  
  function sum(a) {
    if(isArrayLike(a)) {
      var total = 0;
  
      for(var i = 0; i < a.length; i++) {
        var element = a[i];
  
        if(element == null) continue;
        if(isFinite(element)) total += element;
        else throw new Error("sum(): все элементы должны быть числами");
      }
  
      return total;
    } else throw new Error("sum(): аргумент должен быть массивом")
  }
  
  function flexisum_chapter8(a) {
    var total = 0;
  
    for(var i = 0; i < arguments.length; i++) {
      var element = arguments[i], n;
      if(element == null) continue; // Игнорировать null and undefined
      if(isArray(element)) // Если аргумент - массив
        n = flexisum.apply(this, element); // вычислить сумму рекурсивно
      else if(typeof element === 'function') // Иначе, если это функция
        n = Number(element());  // вызвать и преобразовать.
      else n = Number(element); // Иначе попробовать преобразовать.
  
      if(isNaN(n)) // Если не удалось преобразовать в число, возбудить искл.
        throw Error("flexisum(): невозможно преобразовать " + element + " в число")
  
      total += n; // Иначе прибавить n к total
    }
    return total;
  }
  
  /**
   * Определяем функцию extend, которая копирует свойства второго и последующих аргументов
   * в первый аргумент. Здесь реализован обход ошибок в IE: во многих версиях IE loop for/in
   * не перечисляет перечислимые свойства объекта о, если одноименное свойства его прототипа
   * является не перечислимым. Это означает, что такие свойства, как toString, обрабатываютс
   * некорректно, если явно не проверять их.
   */
  var extend_chapter_8 = (function() {
  
    // Сначала проверить наличие ошибок, прежде чем исправлять ее.
    for(var p in { toString: null }) {
      // если мы оказались здесь, значит, цикл for/in работает корректно
      // и можно вернуть простую версию функции extend()
      return function extend(o) {
        for(var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for(var prop in source) o[prop] = source[prop];
        }
        return o;
      }
    }
  
    // Если мы оказались здесь, следовательно, цикл for/in не перечислил
    // свойство toString тестового объекта. По­этому необходимо вернуть версию extend(),
    // которая явно проверяет неперечислимость свойств прототипа Object.prototype.
  
    // Список свойств, которые необходимо проверить
    var protoprops = [
      "toString",
      "valueOf",
      "constructor",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "toLocaleString"
    ];
  
    return function patched_extend(o) {
      for(var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
  
        // Скопировать все перечислимые свойства
        for(var prop in source) o[prop] = source[prop];
  
        // А теперь проверить специальные случаи свойств
        for(var j = 0; j < protoprops.length; j++) {
          prop = protoprops[j];
          if(source.hasOwnProperty(prop)) o[prop] = source[prop];
        }
      }
  
      return o;
    };
  })();
  
  // Эта функция добавляет методы доступа к свойству с заданным именем объекта o.
  // Методы получают имена вида get<name> и set<name>. Если дополнительно предоставляется
  // функция проверки, метод записи будет использовать ее для проверки значения
  // перед сохранением. Если функция проверки возвращает false,
  // метод записи генерирует исключение.
  //
  // Необычность такого подхода заключается в том, что значение свойства,
  // доступного методам, сохраняется не в виде свойства объекта o, а в виде
  // локальной переменной этой функции. Кроме того, методы доступа также определяются
  // внутри этой функции и потому получают доступ к этой локальной переменной.
  // Это означает, что значение доступно только этим двум методам и не может быть
  // установлено или изменено иначе, как методом записи.
  function addPrivateProperty(o, name, predicate) {
    var value; // Это значение свойства
  
    // Метод чтения просто возвращает значение.
    o["get" + name] = function() {
      return value;
    };
  
    // Метод записи сохраняет значение или возбуждает исключение,
    // если функция проверки отвергает это значение.
    o["set" + name] = function(v) {
      if(predicate && !predicate(v))
        throw Error("set" + name + ": недопустимое значение " + v);
      else
        value = v;
    };
  }
  
  // Следующий фрагмент демонстрирует работу метода addPrivateProperty().
  var o = {};    // Пустой объект
  
  // Добавить к свойству методы доступа с именами getName() и setName()
  // Обеспечить допустимость только строковых значений
  addPrivateProperty(o, "Name", function(x) {
    return typeof x == "string";
  });
  
  // Замещает метод m объекта o версией метода, коротая регистрирует сообщения
  // до и после вызова оригинального метода.
  function trace(o, m) {
    var original = o[m];
  
    o[m] = function() {
      console.log(new Date(), "Entering: ", m);
      var result = original.apply(this, arguments);
      console.log(new Date(), "Exiting: ", m);
      return result;
    }
  }
  
  /**
   * Вызвать ошибку если функция не была вызвана через delay мс.
   * Если функция не была вызвана через n секунд мы вызываем ошибку. В интервале от 0 до n вызов функции
   * @param fn
   * @param delay
   * @returns {Function}
   */
  function timeoutify(fn, delay){
    var intv = setTimeout(function(){
      intv = null;
      fn(new Error('Timeout !'))
    }, delay);
  
    return function(){
      if(intv){
        clearTimeout(intv);
        fn.apply(this, arguments);
      }
    }
  }
  
  function asyncify(fn) {
    var orig_fn = fn,
      intv = setTimeout( function(){
        intv = null;
        if (fn) fn();
      }, 0)
    ;
    fn = null;
    return function() {
      // активируется слишком быстро, до срабатывания
      // таймера `intv`,
      // обозначающего прохождение асинхронного периода?
      if(intv) {
        fn = orig_fn.bind.apply(orig_fn,
          // добавить `this` обертки в параметры вызова
          // `bind(..)` и каррировать все переданные
          // параметры.
          [this].concat([].slice.call(arguments))
        );
      }
      // асинхронно
      else {
        // вызвать исходную функцию
        orig_fn.apply(this, arguments);
      }
    }
  };
  
  // Возвращает мемоизованную версию функции f. Работает, только если все возможные
  // аргументы f имеют отличающиеся строковые представления.
  function memoize(f) {
    var cache = {}; // Кэш значений сохраняется в замыкании.
    console.log(cache);
    return function() {
      // Создать строковую версию массива arguments для использования
      // в качестве ключа кэша.
      var key = arguments.length + Array.prototype.join.call(arguments, ",");
      if(key in cache) return cache[key];
      else return cache[key] = f.apply(this, arguments);
    };
  }
  
  // рекурсивный цикл
  function factorialRecurs(n, k) {
    if(n === 1) return k;
    else {
      k.push(n);
      return factorial2(n - 1, k);
    }
  }
  
  function composeFactorial() {
    let tmpResult = null, boundArg = arguments, i = arguments.length - 1;
  
    return function compose() {
      if(i < 0) return tmpResult;
      else {
        tmpResult = boundArg[i].apply(this, arguments);
        i--;
        return compose(tmpResult)
      }
    }
  }
  
  /**
   * Находим в строке количество уникальных подстрок разделенных пробелом
   * @param str
   */
  function uniqueLiterals(str){
    let obj = {};
  
    str.split(' ').forEach(val => {
      obj.hasOwnProperty(val) ?
        obj[val]++ :
        Object.defineProperty(obj, val, {
          value: 1,
          writable: true,
          configurable: true,
          enumerable: true
        });
    });
  
    return obj
  }
  
  /**
   * Эта функция высшего порядка возвращает новую функцию, которая
   * передает свои аргументы функции f и возвращает логическое отрицание значения,
   * возвращаемого функцией f
   */
  function not(f) {
    return function() {
      var result = f.apply(this, arguments);
  
      return !result;
    }
  }
  
  // var even = function(x){
  //   return x%2 === 0;
  // };
  //
  // var odd = not(even);
  // console.log([1, 1, 3, 5, 5].every(odd));
  
  /**
   * Возвращает функцию, которая принимает массив в виде аргумента, применяет функцию f
   * к каждому элементу и возвращает массив возвращаемых значений.
   * Эта функция отличается от функции map(), представленной выше.
   */
  function mapper(f) {
    return function(a) {
      return map_ch_8(a, f);
    };
  }
  
  // var increment = function(x) { return x+1; };
  // var incrementer = mapper(increment);
  // console.log(incrementer([1, 2, 3, 4]));
  
  /**
   * Возвращает новую функцию, которая вычисляет f(g(...)). Возвращаемая функция h
   * передает все свои аргументы функции g, затем передает значение, полученное от g,
   * функции f и возвращает результат вызова f. Обе функции, f и g,
   * вызываются с тем же значением this, что и h.
   */
  function compose(f, g) {
    return function() {
      return f.call(this, g.apply(this, arguments))
    }
  }
  
  // var square = function(x) {
  //   return x*x;
  // };
  //
  // var sum = function(x, y){
  //   return x+y;
  // };
  //
  // var sqrt = function(x){
  //   return Math.sqrt(x);
  // };
  //
  // var squareofsum = compose(square, sum);
  // console.log(squareofsum(2, 3));
  
  /**
   * Вспомогательная функция преобразования объекта (или его части),
   * подобного массиву, в настоящий массив. Используется ниже
   * для преобразования объекта arguments в настоящий массив.
   */
  function array(a, n) {
    return Array.prototype.slice.call(a, n || 0)
  }
  
  // Аргументы этой функции помещаются в начало списка
  function partialLeft(f /*, ...*/) {
    var args = arguments;// Сохранить внешний массив аргументов
  
    return function() {// Вернуть эту функцию
      var a = array(args, 1);// Начиная с элемента 1 во внеш. масс.
      a = a.concat(array(arguments));// Добавить внутренний массив аргум., начиная с 1.
      return f.apply(this, a);// Вызывать f c этим списком аргументов
    }
  }
  
  // Аргументы этой функции помещаются в конец списка
  function partialRight(f /*, ...*/) {
    var args = arguments;               // Сохранить внешний массив аргументов
    return function() {                 // И вернуть эту функцию
      var a = array(arguments);       // Начинать с внутр. масс. аргументов
      a = a.concat(array(args, 1));    // Добавить внешние арг., начиная с 1.
      return f.apply(this, a);        // Вызвать f с этим списком аргументов
    };
  }
  
  // Аргументы этой функции играют роль шаблона. Неопределенные значения
  // в списке аргументов заполняются значениями из внутреннего набора.
  function partial(f /*, ... */) {
    var args = arguments;               // Сохранить внешний массив аргументов
    return function() {
      var a = array(args, 1);         // Начинать с внешнего массива аргументов
      var i = 0, j = 0;
      // Цикл по этим аргументам, заменить значения undefined значениями
      // из внутреннего списка аргументов
      for(; i < a.length; i++)
        if(a[i] === undefined) a[i] = arguments[j++];
      // Добавить оставшиеся внутренние аргументы в конец списка
      a = a.concat(array(arguments, j));
      return f.apply(this, a);
    };
  }
  
  function defineClass(constructor, methods, static){
    if(methods) extend(constructor.prototype, methods);
    if(static) extend(constructor, static);
  
    return constructor;
  }
    
  /**
   * Возвращает тип значения в виде строки:
   *   -Если o - null, возвращает "null", если o - NaN, возвращает "nan".
   *   -Если typeof возвращает значение, отличное от "object", возвращает это значение.
   *    (Обратите внимание, что некоторые реализации идентифицируют объекты
   *    регулярных выражений как функции.)
   *   -Если значение атрибута class объекта o отличается от "Object",
   *    возвращает это значение.
   *   -Если o имеет свойство constructor, а конструктор имеет имя, возвращает
   *    имя конструктора.
   *   -Иначе просто возвращает "Object".
   **/
  
  function type(o) {
    var t, c, n; // type, class, name
  
    // Специальный случай для значения null:
    if(o === null) return "null";
  
    // Другой специальный случай: NaN - единственное значение, не равное самому себе:
    if(o !== o) return "nan";
  
    // Применять typeof для любых значений, отличных от "object".
    // Так идентифицируются простые значения и функции.
    if ((t = typeof o) !== "object") return t;
  
    // Вернуть класс объекта, если это не "Object".
    // Так идентифицируется большинство встроенных объектов.
    if ((c = classof(o)) !== "Object") return c;
  
    // Вернуть имя конструктора объекта, если имеется
    if (o.constructor && typeof o.constructor === "function" &&
      (n = o.constructor.getName())) return n;
  
    // Не удалось определить конкретный тип, по­этому остается лишь
    // просто вернуть "Object"
    return "Object";
  }
  
  // Возвращает класс объекта.
  function classof(o) {
    return Object.prototype.toString.call(o).slice(8,-1);
  }
  
  function quacks(o, /* arguments */){
    for(var i = 1; i < arguments.length; i++){
      var arg = arguments[i];
  
      switch(typeof arg) {
        case 'string':
          if(typeof o[arg] !== 'function') return false;
          continue;
        case 'function':
          arg = arg.prototype;
        case 'object':
          for(var m in arg){
            if(typeof arg[m] !=='function') continue;
            if(typeof o[m] !== 'function') return false;
          }
      }
    }
  
    return true;
  }
  
  function defineSuperClass(
    superclass, constructor, methods, statics
  ){
    // Установить объект-прототип подкласса
    constructor.prototype = inherit(superclass, constructor, methods, statics);
    constructor.prototype.constructor = constructor;
  
    // Скопировать методы methods и statics, как в случае с обычными классами
    if(methods) extend(constructor.prototype, methods);
    if(statics) extend(constructor, statics);
  
    // Вернуть класс
    return constructor;
  }

  module.exports = {
    inherit,
    extend,
    merge,
    restrict,
    subtract,
    intersection,
    keys,
    defineSuperClass,
    quacks,
    classof,
    type,
    defineClass,
    partial,
    partialRight,
    partialLeft,
    compose,
    mapper,
    not,
    uniqueLiterals,
    composeFactorial,
    factorialRecurs,
    memoize,
    asyncify,
    timeoutify,
    trace,
    addPrivateProperty
  }