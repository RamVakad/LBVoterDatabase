var PetitionStatusModule = angular.module("PetitionStatusModule", ['LoggingModule', 'AuthModule', 'UtilsModule']);

PetitionStatusModule.factory("PetStatusManager", function($q, $http, Logging, AuthFactory, Utils) {
    var factory = {};

    factory.PetitionData = null;

    factory.pullPetitionData = function() {
        $http.get(Utils.getBaseHref() + '/php/pullPetitionData.php?PASSWORD=' + AuthFactory.getWorkingPassword()).then(function(res) {
            if (res.data === "NOAUTH") {
                Logging.log("Pull Petition Data called without a working password.", 1)
                return;
            } else if (res.data === "NORES") {
                factory.PetitionData = {};
                Logging.log("Petition Data is Null.", 0)
            } else if (res.data === "DBCONNFAIL") {
                Logging.log("Database Connection Failed At pullPetData.php", 1)
                return;
            } else {
              factory.PetitionData = res.data;
              Logging.log("Petition Data Retreived Successfully.", 0)
            }
        },
        function(err) {
            Logging.log("ERR WHILE RETRIEVING PETITION DATA: " + err);
        });
    }

    factory.getPetitionStatus = function(vid) {
      if (!factory.PetitionData) {
          Logging.log("Ahh! PetData == Null and getPetStatus was called.", 1);
          return "ERROR";
      }
      for(var i = 0; i < factory.PetitionData.length; i++) {
          if(factory.PetitionData[i].VoterID == vid) {
            return factory.PetitionData[i];
          }
      }
      return { Status: "Pending" };
    }

    /* No no no. Nom nom nom.
    factory.getPetitionStatus = function(vid) {
        var defer = $q.defer();
        $http.get(factory.getBaseHref() + '/php/getPetitionStatus.php?VID='+vid+'&PASSWORD='+AuthFactory.getWorkingPassword()).then(function(res) {
            if (res.data[0].Status) {
                defer.resolve(res.data[0]);
            }
            if (res.data === "NORES") {
                defer.resolve({ Status:'Pending', Date:new Date()});
            }
        },
        function(err) {
            console.log("ERR WHILE RETRIEVING PETITION STATUS: " + err);
        });

        return defer.promise;
    }
    */

    factory.updatePetitionStatus = function (vid, status, date) {
      $http.get(Utils.getBaseHref() + '/php/setPetitionStatus.php?VID='+vid+'&DATE='+date+'&STATUS='+status+'&PASSWORD='+AuthFactory.getWorkingPassword()).then(function(res) {
          if (!res.data === "SUCCESS") {
              Logging.log("Success Response Wasn't Received for updatePetitionData: " + vid + ", " + signed, 0)
              Logging.log("Response: " + res, 0)
          } else {
              for(var i = 0; i < factory.PetitionData.length; i++) {
                  if(factory.PetitionData[i].VoterID == vid) {
                    factory.PetitionData[i].Status = status;
                    factory.PetitionData[i].Date = date;
                  }
              }
          }
      },
      function(err) {
          Logging.log("ERR WHILE SETTING UPDATING PETITION STATUS: " + err, 1);
      });
    }


    Logging.log("Petition Status Manager Loaded.", 0)
    return factory;
});
