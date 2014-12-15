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
  
  var registry = {}, seen = {}, state = {};
  var FAILED = false;

  define = function(name, deps, callback) {
  
    if (!_isArray(deps)) {
      callback = deps;
      deps     =  [];
    }
  
    registry[name] = {
      deps: deps,
      callback: callback
    };
  };

  function reify(deps, name, seen) {
    var length = deps.length;
    var reified = new Array(length);
    var dep;
    var exports;

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        exports = reified[i] = seen;
      } else {
        reified[i] = require(resolve(dep, name));
      }
    }

    return {
      deps: reified,
      exports: exports
    };
  }

  requirejs = require = requireModule = function(name) {
    if (state[name] !== FAILED &&
        seen.hasOwnProperty(name)) {
      return seen[name];
    }

    if (!registry[name]) {
      throw new Error('Could not find module ' + name);
    }

    var mod = registry[name];
    var reified;
    var module;
    var loaded = false;

    seen[name] = { }; // placeholder for run-time cycles

    try {
      reified = reify(mod.deps, name, seen[name]);
      module = mod.callback.apply(this, reified.deps);
      loaded = true;
    } finally {
      if (!loaded) {
        state[name] = FAILED;
      }
    }

    return reified.exports ? seen[name] : (seen[name] = module);
  };

  function resolve(child, name) {
    if (child.charAt(0) !== '.') { return child; }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase;

    if (nameParts.length === 1) {
      parentBase = nameParts;
    } else {
      parentBase = nameParts.slice(0, -1);
    }

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') { parentBase.pop(); }
      else if (part === '.') { continue; }
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

      destroyRedactor: function() {
        this.removeObserver('value', this, this.valueDidChange);

        this.$().redactor('core.destroy');
      },

      initRedactor: Ember.on('didInsertElement', function() {
        var redactorOptions = {};

        redactorOptions.changeCallback = Ember.run.bind(this, this.changeCallback);

        Ember.EnumerableUtils.forEach(this.get('redactorSettings'), function(key) {
          if (key in this) { redactorOptions[key] = this.get(key); }
        }, this);

        // By default, Redactor indents HTML when `code.get` is called. This is
        // a problem because `valueDidChange` will then always call `code.set`,
        // which resets the cursor position.
        redactorOptions.tabifier = false;

        this.$().redactor(redactorOptions);

        this.addObserver('value', this, this.valueDidChange);
        this.updateRedactorCode();

        this.one('willDestroyElement', this, this.destroyRedactor);
      }),

      updateRedactorCode: function() {
        var value = this.get('value');
        var $elem = this.$();

        if (value && value !== $elem.redactor('code.get')) {
          $elem.redactor('code.set', value);
        }
      },

      valueDidChange: function() {
        Ember.run.once(this, this.updateRedactorCode);
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