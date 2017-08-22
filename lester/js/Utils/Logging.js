var LoggingModule = angular.module("LoggingModule", []);

LoggingModule.factory("Logging", function() {
  var factory = {};

  factory.log = function(string, logCode) {
      if (lester.hrefBase === "/lester") console.log(logCode + ': ' + string); //Not in PROD.
  }

  return factory;
});
