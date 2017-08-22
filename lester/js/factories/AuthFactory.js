var AuthModule = angular.module("AuthModule", ['LoggingModule']);

AuthModule.factory("AuthFactory", function(Logging) {
  var factory = {};

  factory.workingPassword = "NOAUTH";
  factory.Authorized = false;

  factory.getWorkingPassword = function() {
      return factory.workingPassword;
  }

  factory.setWorkingPassword = function(pass) {
      factory.workingPassword = pass;
      factory.Authorized = true;
      Logging.log("Working Password Set.", 0)
  }

  factory.isAuthed = function() {
    return factory.Authorized;
  }

  return factory;
});
