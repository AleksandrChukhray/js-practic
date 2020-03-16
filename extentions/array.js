Object.defineProperty(Array.prototype, 'log', {
    writable: false,
    enumerable: false,
    configurable: false,
    value: function() {
      return console.log(this);
    }
});