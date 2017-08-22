var VoterDetailModule = angular.module("VoterDetailModule", ['UtilsModule', 'AuthModule', 'LoggingModule', 'PetitionStatusModule']);

VoterDetailModule.directive('voterDetail',  function() {
  return {
    restrict: 'E',
    scope: false,
    templateUrl: "partials/VoterDetails.html",
    controller: function($scope, $http, $document, Utils, Logging, PetStatusManager, AuthFactory) {
        if($scope.voter == null) {
          $scope.voter = $scope.Voter; //Need to look into how to make isolated scope work in my favor.
        }

        $scope.PetData = PetStatusManager.getPetitionStatus($scope.voter.VOTERID)
        $scope.PetStatus = $scope.PetData.Status;
        $scope.PetDate = new Date($scope.PetData.Date);

        $scope.firstPh = $scope.voter.PHONE.substr(0, 3);
        $scope.secondPh = $scope.voter.PHONE.substr(3, 3);
        $scope.lastPh = $scope.voter.PHONE.substr(6);
        $scope.geocoder = new google.maps.Geocoder(); //Remove and pull from GEOFACTORY!
        $scope.map = null;

        $scope.updatePetStatus = function() {
            $scope.PetDate = new Date();
            PetStatusManager.updatePetitionStatus($scope.voter.VOTERID, $scope.PetStatus, $scope.PetDate);
        }

        $scope.petPending = function() {
            $scope.PetStatus = 'Pending';
            $scope.updatePetStatus();
        }

        $scope.petAcquired = function() {
            $scope.PetStatus = 'Acquired';
            $scope.updatePetStatus();
        }

        $scope.petRefused = function() {
            $scope.PetStatus = 'Refused';
            $scope.updatePetStatus();
        }

        $scope.petOpposition = function() {
            $scope.PetStatus = 'Opposition';
            $scope.updatePetStatus();
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
            $scope.map = new google.maps.Map($document[0].getElementById('map'), mapOptions);
            google.maps.event.addListener($scope.map, 'tilesloaded', function() {
                if (!$scope.tilesloaded) {
                  Utils.fixGoogleMapsClick($document);
                  $scope.tilesloaded = true;
                } else {
                  google.maps.event.clearListeners($scope.map, 'tilesLoaded')
                }
            });
        }

        $scope.mapToVoter =  function() {
            var address = $scope.voter.ADDR_NUM + ' ' + $scope.voter.ADDR_STR + ' ' + $scope.voter.ADDR_TYPE + ', '
            + $scope.voter.ADDR_CITY + ', NY ' + $scope.voter.ADDR_ZIP;
            $scope.geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == 'OK') {
                    $scope.map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        position: results[0].geometry.location,
                        url: "http://maps.apple.com/?q=" + results[0].geometry.location.lat() + "," + results[0].geometry.location.lng()
                    });
                    $scope.map.setZoom(16)
                } else {
                    console.log('Geocode was not successful for the following reason: ' + status);
                }
            });
        }

        if($scope.SearchPage) {
          $scope.initMap();
          $scope.mapToVoter();
        }

    }
  }
});
