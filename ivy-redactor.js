(function() {;
var define, requireModule, require, requirejs;

(function() {

  var _isArray;
  if (!Array.isArray) {
    _isArray = function (x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    };
  } else {
    _isArray = Array.isArray;
  }

  var registry = {}, seen = {};
  var FAILED = false;

  var uuid = 0;

  function tryFinally(tryable, finalizer) {
    try {
      return tryable();
    } finally {
      finalizer();
    }
  }

  function unsupportedModule(length) {
    throw new Error("an unsupported module was defined, expected `define(name, deps, module)` instead got: `" + length + "` arguments to define`");
  }

  var defaultDeps = ['require', 'exports', 'module'];

  function Module(name, deps, callback, exports) {
    this.id       = uuid++;
    this.name     = name;
    this.deps     = !deps.length && callback.length ? defaultDeps : deps;
    this.exports  = exports || { };
    this.callback = callback;
    this.state    = undefined;
    this._require  = undefined;
  }


  Module.prototype.makeRequire = function() {
    var name = this.name;

    return this._require || (this._require = function(dep) {
      return require(resolve(dep, name));
    });
  }

  define = function(name, deps, callback) {
    if (arguments.length < 2) {
      unsupportedModule(arguments.length);
    }

    if (!_isArray(deps)) {
      callback = deps;
      deps     =  [];
    }

    registry[name] = new Module(name, deps, callback);
  };

  // we don't support all of AMD
  // define.amd = {};
  // we will support petals...
  define.petal = { };

  function Alias(path) {
    this.name = path;
  }

  define.alias = function(path) {
    return new Alias(path);
  };

  function reify(mod, name, seen) {
    var deps = mod.deps;
    var length = deps.length;
    var reified = new Array(length);
    var dep;
    // TODO: new Module
    // TODO: seen refactor
    var module = { };

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        module.exports = reified[i] = seen;
      } else if (dep === 'require') {
        reified[i] = mod.makeRequire();
      } else if (dep === 'module') {
        mod.exports = seen;
        module = reified[i] = mod;
      } else {
        reified[i] = requireFrom(resolve(dep, name), name);
      }
    }

    return {
      deps: reified,
      module: module
    };
  }

  function requireFrom(name, origin) {
    var mod = registry[name];
    if (!mod) {
      throw new Error('Could not find module `' + name + '` imported from `' + origin + '`');
    }
    return require(name);
  }

  function missingModule(name) {
    throw new Error('Could not find module ' + name);
  }
  requirejs = require = requireModule = function(name) {
    var mod = registry[name];


    if (mod && mod.callback instanceof Alias) {
      mod = registry[mod.callback.name];
    }

    if (!mod) { missingModule(name); }

    if (mod.state !== FAILED &&
        seen.hasOwnProperty(name)) {
      return seen[name];
    }

    var reified;
    var module;
    var loaded = false;

    seen[name] = { }; // placeholder for run-time cycles

    tryFinally(function() {
      reified = reify(mod, name, seen[name]);
      module = mod.callback.apply(this, reified.deps);
      loaded = true;
    }, function() {
      if (!loaded) {
        mod.state = FAILED;
      }
    });

    var obj;
    if (module === undefined && reified.module.exports) {
      obj = reified.module.exports;
    } else {
      obj = seen[name] = module;
    }

    if (obj !== null &&
        (typeof obj === 'object' || typeof obj === 'function') &&
          obj['default'] === undefined) {
      obj['default'] = obj;
    }

    return (seen[name] = obj);
  };

  function resolve(child, name) {
    if (child.charAt(0) !== '.') { return child; }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase = nameParts.slice(0, -1);

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') {
        if (parentBase.length === 0) {
          throw new Error('Cannot access parent module of root');
        }
        parentBase.pop();
      } else if (part === '.') { continue; }
      else { parentBase.push(part); }
    }

    return parentBase.join('/');
  }

  requirejs.entries = requirejs._eak_seen = registry;
  requirejs.clear = function(){
    requirejs.entries = requirejs._eak_seen = registry = {};
    seen = state = {};
  };
})();

;define("ivy-redactor/components/ivy-redactor", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      /**
       * The HTML content of the editor.
       *
       * @property value
       * @type {String}
       * @default null
       */
      value: null,

      tagName: 'textarea',

      concatenatedProperties: ['redactorCallbacks', 'redactorSettings'],

      redactorCallbacks: [
        'changeCallback'
      ],

      redactorSettings: [
        'activeButtons',
        'activeButtonsStates',
        'allowedAttr',
        'allowedTags',
        'buttonSource',
        'buttons',
        'buttonsHide',
        'buttonsHideOnMobile',
        'cleanOnPaste',
        'cleanSpaces',
        'cleanStyleOnEnter',
        'convertImagesLinks',
        'convertLinks',
        'convertUrlLinks',
        'convertVideoLinks',
        'deniedTags',
        'formatting',
        'formattingAdd',
        'linebreaks',
        'linkNofollow',
        'linkProtocol',
        'linkSize',
        'linkTooltip',
        'maxHeight',
        'minHeight',
        'paragraphize',
        'pastePlainText',
        'placeholder',
        'preSpaces',
        'removeComments',
        'removeDataAttr',
        'removeEmpty',
        'replaceDivs',
        'replaceStyles',
        'replaceTags',
        'shortcuts',
        'shortcutsAdd',
        'tabAsSpaces',
        'tabindex',
        'toolbar',
        'toolbarExternal',
        'toolbarFixed',
        'toolbarFixedTarget',
        'toolbarOverflow'
      ],

      /**
       * Called when the HTML content changes. Updates the `value` property.
       *
       * @method changeCallback
       * @param {String} html
       */
      changeCallback: function(html) {
        this.set('value', html);
      },

      _destroyRedactor: Ember.on('willDestroyElement', function() {
        this.removeObserver('value', this, this._valueDidChange);

        this.$().redactor('core.destroy');
      }),

      _initRedactor: Ember.on('didInsertElement', function() {
        var options = {};

        this._setupRedactorCallbacks(options);
        this._setupRedactorSettings(options);

        this.$().redactor(options);

        this.addObserver('value', this, this._valueDidChange);
        this._valueDidChange();
      }),

      _setupRedactorCallbacks: function(options) {
        Ember.EnumerableUtils.forEach(this.get('redactorCallbacks'), function(name) {
          options[name] = Ember.run.bind(this, name);
        }, this);
      },

      _setupRedactorSettings: function(options) {
        Ember.EnumerableUtils.forEach(this.get('redactorSettings'), function(key) {
          if (key in this) {
            options[key] = this.get(key);
          }
        }, this);

        // By default, Redactor indents HTML when `code.get` is called. This is
        // a problem because `valueDidChange` will then always call `code.set`,
        // which resets the cursor position.
        options.tabifier = false;
      },

      _updateRedactorCode: function() {
        var value = this.get('value');
        var $elem = this.$();

        if (value && value !== $elem.redactor('code.get')) {
          $elem.redactor('code.set', value);
        }
      },

      _valueDidChange: function() {
        Ember.run.scheduleOnce('afterRender', this, this._updateRedactorCode);
      }
    });
  });
;define("ivy-redactor/index", 
  ["ivy-redactor/components/ivy-redactor","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var IvyRedactorComponent = __dependency1__["default"];

    __exports__.IvyRedactorComponent = IvyRedactorComponent;
  });
;/* global define, require */
define('ivy-redactor-shim', ['exports'], function(__exports__) {
  'use strict';
  __exports__['default'] = function(container) {
    container.register('component:ivy-redactor', require('ivy-redactor/components/ivy-redactor')['default']);
  };
});
;/* global define, require, window */
var addonName = 'ivy-redactor';

define('ember', ['exports'], function(__exports__) {
  __exports__['default'] = window.Ember;
});

var index = addonName + '/index';
define(addonName, ['exports'], function(__exports__) {
  var library = require(index);
  Object.keys(library).forEach(function(key) {
    __exports__[key] = library[key];
  });
});

// Glue library to a global var
window.IvyRedactor = require(index);

// Register library items in the container
var shim = addonName + '-shim';
window.Ember.Application.initializer({
  name: shim,

  initialize: function(container) {
    require(shim)['default'](container);
  }
});
})();