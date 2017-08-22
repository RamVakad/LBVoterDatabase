var GeocodeModule = angular.module("GeocodeModule", ['LoggingModule']);
//Add Security
GeocodeModule.factory("GeocodeFactory", function(Logging) {
    var factory = {};

    /*
    factory.Fixes = {
      1-oak-ct-40.591894,-73.666844
      3-oak-ct-40.591894,-73.666841
      4-oak-ct-40.591894,-73.666838
      5-oak-ct-40.591895,-73.666835
      6-oak-ct-40.591895,-73.666832
      7-oak-ct-40.591895,-73.666829
      8-oak-ct-40.591895,-73.666827
      9-oak-ct-40.591895,-73.666824
      10-oak-ct-40.591895,-73.666821
      15-oak-ct-40.591896,-73.666806
      16-oak-ct-40.591896,-73.666803
      21-oak-ct-40.591897,-73.666789
      22-oak-ct-40.591897,-73.666786
      23-oak-ct-40.591897,-73.666783
      24-oak-ct-40.591897,-73.666780
      25-oak-ct-40.591898,-73.666777
      26-oak-ct-40.591898,-73.666774
      35-oak-ct-40.591899,-73.666748
      36-oak-ct-40.591899,-73.666745
    }
    */

    factory.GeocodeData = null;

    factory.getGeocodeData = function() {
        if (factory.GeocodeData == null) {
              var currentIter = 0;
              factory.GeocodeData = []
              var words = GeocodeData.split(',');
              for (var i = 0; i < words.length; i+=3) {
                  factory.GeocodeData[currentIter] = {
                    'VOTERID': words[i],
                    'LAT': parseFloat(words[i+1]),
                    'LNG': parseFloat(words[i+2])
                  }
                  currentIter++;
              }
              Logging.log((currentIter + 1) + " Geocodes Parsed & JSONified", 0)
          }
          return factory.GeocodeData;

    }

    factory.sortGeocodeData = function(LAT, LNG) { //Sorts all the GEOCODE data from nearest to farthest.

        var distanceBetween = function(LAT1, LNG1, LAT2, LNG2) {
          return Math.sqrt( ( Math.pow((LAT2 - LAT1), 2) + Math.pow((LNG2 - LNG1), 2) ) );
        }

        if (factory.GeocodeData != null) {
            for(var i = 0; i < factory.GeocodeData.length; i++) {
                for(var j = 0; j < factory.GeocodeData.length; j++) { // Sorry CPU.
                    if (distanceBetween(LAT, LNG,
                        factory.GeocodeData[i].LAT,
                        factory.GeocodeData[i].LNG) <
                        distanceBetween(LAT, LNG,
                        factory.GeocodeData[j].LAT,
                        factory.GeocodeData[j].LNG)) {

                          var temp = factory.GeocodeData[i];
                          factory.GeocodeData[i] = factory.GeocodeData[j];
                          factory.GeocodeData[j] = temp;

                    }
                }
            }
            Logging.log("Sorted all geolocations according to user's position: " + LAT + ", " + LNG, 0)
            return factory.GeocodeData;
        }
    }

    factory.getGeocodeFromVid = function(id) {
        for(var i = 0; i < factory.GeocodeData.length; i++) {
            if (factory.GeocodeData[i].VOTERID === id) {
              return factory.GeocodeData[i];
            }
        }
    }

    Logging.log("Geocode Factory Loaded.", 0)
    return factory;
});
