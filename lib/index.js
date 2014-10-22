'use strict';

function $(argName) {
  return {
    $: $,
    argName: argName
  };
}

module.exports = function (obj, defaultPosition) {
  defaultPosition = (defaultPosition || defaultPosition === 0) ? defaultPosition : -1;

  var prototype = {};

  function createPointlessWrapper(func) {
    return function () {
      var args = [];
      var pf = [func, args, -1, []];
      var specific = false;
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] === $) {
          pf[2] = i;
          specific = true;
          break;
        }
      }
      for (i = 0; i < arguments.length; i++) {
        if (i === defaultPosition && !specific) {
          args.push(null);
          args.push(arguments[i]);
        } else {
          args.push(arguments[i]);
          if (arguments[i].$ === $) {
            pf[3].push([(!specific && defaultPosition > -1 && i > defaultPosition ? 1 : 0) + i, arguments[i].argName]);
          }
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

  return function (pointPosition) {
    pointPosition = (pointPosition || pointPosition === 0) ? pointPosition : -1;

    function pointlessObj() {
      var point = arguments[pointPosition === -1 ? (arguments.length - 1) : pointPosition];
      pointlessObj._chain.forEach(function (pf) {
        var f = pf[0];
        var args = pf[1];
        var $pos = pf[2];
        var namedArgs = pf[3];
        if ($pos > -1) {
          args[$pos] = point;
        } else if (defaultPosition === -1) {
          args[args.length - 1] = point;
        } else {
          args[defaultPosition] = point;
        }
        for (var i = 0; i < namedArgs.length; i++) {
          var namedArg = namedArgs[i][1];
          args[namedArgs[i][0]] = arguments[namedArg];
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
