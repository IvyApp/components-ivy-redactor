"use strict";
var Component = require("./component")["default"] || require("./component");

exports["default"] = {
  name: 'ivy-redactor',

  initialize: function(container) {
    container.register('component:ivy-redactor', Component);
  }
};