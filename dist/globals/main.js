!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.ivy||(f.ivy={})).redactor=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = Ember.Component.extend({
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
},{}],2:[function(_dereq_,module,exports){
"use strict";
var Component = _dereq_("./component")["default"] || _dereq_("./component");

exports["default"] = {
  name: 'ivy-redactor',

  initialize: function(container) {
    container.register('component:ivy-redactor', Component);
  }
};
},{"./component":1}],3:[function(_dereq_,module,exports){
"use strict";
var Component = _dereq_("./component")["default"] || _dereq_("./component");
var initializer = _dereq_("./initializer")["default"] || _dereq_("./initializer");

exports.Component = Component;
exports.initializer = initializer;
},{"./component":1,"./initializer":2}]},{},[3])
(3)
});