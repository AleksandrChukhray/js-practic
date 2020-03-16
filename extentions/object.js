  /**
   * Добавляет неперечислимый метод extend() в Object.prototype.
   * Этот метод расширяет объекты возможность копирования свойств из объекта,
   * переданного в аргументе. Этот метод копирует не только значение свойств, но
   * и все их атрибуты. Из объекта в аргументе копируется все собственные свойства
   * (даже недоступные для перечисления), за исключением одноименных свойств, имеющихся
   * в текущем объекте.
   */
  
  Object.defineProperty(Object.prototype, 'extend', {
    writable: false,
    enumerable: false,
    configurable: true,
    value: function(o) {
      var names = Object.getOwnPropertyNames(o);
  
      for(var i = 0; i < names.length; i++) {
        // Пропустить свойства уже имеющиеся в данном объекте
        if(names[i] in this) continue;
  
        // Получить дескриптор свойства из о
        var desc = Object.getOwnPropertyDescriptor(o, names[i]);
  
        Object.defineProperty(this, names[i], desc);
      }
    }
  });