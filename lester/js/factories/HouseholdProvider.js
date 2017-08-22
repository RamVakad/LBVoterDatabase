var HouseholdProviderModule = angular.module("HouseholdProviderModule", ['LoggingModule', 'GeocodeModule', 'DataModule']);

HouseholdProviderModule.factory("HouseholdProvider", function(Logging, GeocodeFactory, DataFactory) {
  var factory = {};

  factory.householdIter = 0;
  factory.Households = [];

  factory.loadHouseholds =  function() {
      factory.GeoData = GeocodeFactory.getGeocodeData();
      for(var i = 0; i < factory.GeoData.length; i++) {
          var preExisting = factory.householdExists(factory.GeoData[i].LAT, factory.GeoData[i].LNG);
          if (!preExisting) {
              factory.Households[factory.householdIter] = {};
              factory.Households[factory.householdIter].LAT = factory.GeoData[i].LAT;
              factory.Households[factory.householdIter].LNG = factory.GeoData[i].LNG;
              factory.Households[factory.householdIter].VOTERS = [];
              factory.Households[factory.householdIter].VOTERS.push(DataFactory.getVoterFromVid(factory.GeoData[i].VOTERID));
              factory.householdIter++;
          } else {
              preExisting.VOTERS.push(DataFactory.getVoterFromVid(factory.GeoData[i].VOTERID))
          }
      }
      Logging.log('All Households Parsed', 0)
  }

  factory.householdExists = function(lat, lng) {
      for(var i = 0; i < factory.Households.length; i++) {
          if (lat == factory.Households[i].LAT && lng == factory.Households[i].LNG) {
            return factory.Households[i];
          }
      }
      return null;
  }

  factory.getHouseholds = function() {
    return factory.Households;
  }

  Logging.log('Household Provider Loaded', 0)

  return factory;
});
