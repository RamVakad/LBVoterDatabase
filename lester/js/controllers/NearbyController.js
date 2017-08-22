var NearbyModule = angular.module("NearbyModule", ['AuthModule', 'DataModule', 'GeocodeModule', 'SliderMenuModule', 'UtilsModule', 'LoggingModule']);

NearbyModule.controller('NearbyController', function($scope, AuthFactory, $document, $location, $interval, Logging, DataFactory, GeocodeFactory, Utils) {
    if (!AuthFactory.isAuthed()) {
      $location.path(Utils.getBaseHref() + '/');
      return;
    }

    $scope.userCoords = null;
    $scope.latLngBounds = new google.maps.LatLngBounds();
    $scope.GeoData = GeocodeFactory.getGeocodeData();
    $scope.firstLocationUpdate = false;
    $scope.AllVoters = DataFactory.getVoterJSON();
    $scope.Geocoder = new google.maps.Geocoder();
    $scope.NearbyMap = null;
    $scope.NearbyPage = true;
    $scope.locationDot = null;
    $scope.markers = [];

    $scope.GeocodeAddress = function(address, callback) {
        $scope.Geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              callback(results[0].geometry.location, status);
          } else {
              callback([0, 0], status);
          }
        });
    }

    $scope.initMap =  function() {
        var latlng = new google.maps.LatLng(40.588437, -73.657908);
        var mapOptions = {
          zoom: 12,
          center: latlng,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: true,
          fullscreenControl: false,
          gestureHandling: "greedy"
        }
        $scope.NearbyMap = new google.maps.Map(document.getElementById('NearbyMap'), mapOptions);
        google.maps.event.addListener($scope.NearbyMap, 'tilesloaded', function() {
            if (!$scope.tilesloaded) {
              Utils.fixGoogleMapsClick($document);
              $scope.loadMarkers();
              $scope.tilesloaded = true;
            } else {
              google.maps.event.clearListeners($scope.NearbyMap, 'tilesLoaded')
            }
        });
        /*
        var locationOptions = {
            icon: '/lester/images/bluecircle.png',
            on: {
                geolocationError: function(error) { Logging.log(error.message, 1) },
                firstGeolocationUpdate: function(loc) {
                  $scope.userCoords = loc.coords;
                  Logging.log("User's Location Determined")
                  GeocodeFactory.sortGeocodeData($scope.userCoords.latitude, $scope.userCoords.longitude);
                  var latLng = new google.maps.LatLng($scope.userCoords.latitude, $scope.userCoords.longitude)
                  $scope.latLngBounds.extend(latLng);
                  $scope.NearbyMap.fitBounds($scope.latLngBounds);
                  //Utils.prettifyNearbyPage($document); //Looks ugly when it's over the water.
                },
                geolocationUpdate: function(loc) {
                  //Logging.log("User's Location Updated". 0)
                  $scope.userCoords = loc.coords;
                }
            }
        }
        //$scope.locationDot = new BlueDot($scope.NearbyMap, locationOptions);
        */
    }

    $scope.voterSelected = function(index) {
        $scope.Voter = $scope.Voters[index];
        $scope.backAnim = true;
    }

    $scope.markerIter = 0;
    $scope.GeoDataIter = 0;
    $scope.loadMarkerCount = 20;

    $scope.loadMarkers =  function() {
        $scope.GeoData = GeocodeFactory.getGeocodeData(); //This is sorted.
        for(var i = $scope.GeoDataIter; i < $scope.GeoDataIter + $scope.loadMarkerCount; i++) {
            var latLng = new google.maps.LatLng($scope.GeoData[i].LAT, $scope.GeoData[i].LNG)
            var preExisting = $scope.markerExists(latLng);
            if (!preExisting) {
                $scope.markers[$scope.markerIter] = new google.maps.Marker({
                    map: $scope.NearbyMap,
                    position: latLng
                });

                $scope.markers[$scope.markerIter].VOTERS = [];
                $scope.markers[$scope.markerIter].VOTERS.push($scope.GeoData[i].VOTERID);
                with ({ mark: $scope.markers[$scope.markerIter] }) {
                    $scope.markers[$scope.markerIter].LISTENER = google.maps.event.addListener($scope.markers[$scope.markerIter], 'mousedown', function() {
                          $scope.markerClicked(mark);
                    });
                }
                $scope.latLngBounds.extend(latLng);
                $scope.markerIter++;
            } else {
                preExisting.VOTERS.push($scope.GeoData[i].VOTERID)
            }
        }
        $scope.GeoDataIter = $scope.GeoDataIter + $scope.loadMarkerCount;
    }

    $scope.markerExists = function(latLng) {
        for(var i = 0; i < $scope.markers.length; i++) {
            var lat = $scope.markers[i].get("position").lat();
            var lng = $scope.markers[i].get("position").lng();
            if (lat == latLng.lat() && lng == latLng.lng()) {
              return $scope.markers[i];
            }
        }
        return null;
    }

    $scope.closeSelection = function() {
        $scope.backAnim = false;
        $document.find("[class*='nearbyDetailContainer']").removeClass('B');
        $scope.Voters = null;
        $scope.Voter = null;
    }

    $scope.backSelection = function() {
        $interval(function() { $scope.backAnim = false }, 600, 1);
        $scope.Voter = null;
    }

    $scope.markerClicked = function(marker) {
        if(marker.VOTERS.length < 2) {
          $scope.Voters = null;
          $scope.Voter = DataFactory.getVoterFromVid(marker.VOTERS[0])
        } else {
          $scope.Voter = null;
          $scope.Voters = [];
          for (var i = 0; i < marker.VOTERS.length; i++) {
              $scope.Voters.push(DataFactory.getVoterFromVid(marker.VOTERS[i]))
          }
        }
    }

    $scope.initNearby = function() {
      if(!$scope.loaded) {
        $scope.initMap();
        $scope.loaded = true;
      }
    }

    $scope.load = true;
});
