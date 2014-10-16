'use strict';

function $() {
}

module.exports = function (obj, defaultPosition) {
  defaultPosition = (defaultPosition || defaultPosition === 0) ? defaultPosition : -1;

  var prototype = {};

  function createPointlessWrapper(func) {
    return function () {
      var args = [];
      var pf = [func, args];
      for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
        if (arguments[i] === $) {
          pf[2] = i;
        }
      }
      this._chain.push(pf);
      return this;
    };
  }

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var value = obj[key];

      if (typeof value === 'function') {
        prototype[key] = createPointlessWrapper(value);
      }
    }
  }

  return function () {
    function pointlessObj(point) {
      pointlessObj._chain.forEach(function (pf) {
        var f = pf[0];
        var args = pf[1];
        var $pos = pf[2];
        if ($pos || $pos === 0) {
          args[$pos] = point;
        } else if (defaultPosition === -1) {
          args.push(point);
        } else {
          args.splice(defaultPosition, 0, point);
        }
        point = f.apply(obj, args);
      });
      return point;
    }

    pointlessObj._chain = [];

    for (var key in prototype) {
      pointlessObj[key] = prototype[key];
    }

    return pointlessObj;
  };
};

module.exports.$ = $;
