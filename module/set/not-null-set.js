const Set = require('./set').Set; 

/**
 * NonNullSet - подкласс класса Set, который не может содержать элементы со значениями null и undefined
 */
function NonNullSet(){
    // Простое обращение к суперклассу
    // Вызвать конструктор суперкласса как обычную функцию для инициализации объекта который
    // был создан вызовом этого конструктора.

    Set.apply(this, arguments);
}

// Сделать класс NonNullSet подклассом класса Set
NonNullSet.prototype.add = function(){
    // Проверить наличие аргументов со значениями null и undefined
    for(var i = 0; i < arguments.length; i++)
        if(arguments[i] == null)
            throw new Error("Нельзя добавить null или undefined в NonNullSet");
        
    // Вызвать метод базового суперкласса, чтобы фактически добавить элементы
    return Set.prototype.add.apply(this, arguments);
}