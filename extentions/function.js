  const defineSubclass = require('./../lib').defineSubclass;
  
  // Возвращает имя функции (может быть "") или null - для объектов,
  // не являющихся функциями
  Function.prototype.getName = function() {
    if ("name" in this) return this.name;
    return this.name = this.toString().match(/function\s*([^(]*)\(/)[1];
  };

  Function.prototype.extend = function(constructor, methods, statics){
    return defineSubclass(this, constructor, methods, statics);
  }
