define(
  ["./component","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = {
      name: 'ivy-redactor',

      initialize: function(container) {
        container.register('component:ivy-redactor', Component);
      }
    };
  });