(function() {
'use strict';

var app = angular.module("rotationApp", ["teamApp"]);

app.controller("RotationController", ["$scope", "$http", "$mdSidenav", "$mdBottomSheet", function ($scope, $http, $mdSidenav, $mdBottomSheet) {
      var d = new Date();
      $scope.dayOfWeek = d.getDay();

      $http.get("/api/rotations")
          .success(function(data) {
              $scope.rotations = data;
              console.log(data);
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });

     $scope.toggleSidenav = function(menuId) {
       $mdSidenav(menuId).toggle();
       console.log("Executed");
     };

     this.showAddRotation = function($event) {
       $mdBottomSheet.show({
         templateUrl: 'directives/rotations/rotation-add.html',
         targetEvent: $event,
         scope: $scope,
         preserveScope: true
       })
     };

     this.showEditRotation = function($event) {
       $mdBottomSheet.show({
         templateUrl: 'directives/rotations/rotation-edit.html',
         targetEvent: $event,
         scope: $scope,
         preserveScope: true
       })
     };

      $scope.getRotation = function(id){
        $http.get("/api/rotations/" + id)
            .success(function(data) {
                $scope.singleRotation = data;
                //convert mongo string date to Javascript date
                $scope.start_date = new Date($scope.singleRotation[0].start_date);
                $scope.end_date = new Date($scope.singleRotation[0].end_date);
                console.log('Success: ' + data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

      };


      $scope.createRotation = function() {
          $http.post("/api/rotations", $scope.rotationData)
              .success(function(data) {
                  $mdBottomSheet.hide();
                  $scope.rotationData = {};
                  $scope.rotations = data;
                  console.log(data);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });
      };

      $scope.updateRotation = function(id) {
          $scope.singleRotation[0].start_date = $scope.start_date;
          $scope.singleRotation[0].end_date = $scope.end_date;
          $http.put("/api/rotations/" + id, $scope.singleRotation[0])
              .success(function(data) {
                $mdBottomSheet.hide();
                  $scope.singleRotation = {};
                  $scope.rotations = data;
                  console.log(data);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });
      };

      // delete a todo after checking it
      $scope.deleteRotation = function(id) {
          $http.delete("/api/rotations/" + id)
              .success(function(data) {
                  $scope.singleRotation = [];
                  $scope.rotations = data;
                  console.log(data);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });
      };

      //get Teams
      $scope.getTeams = function(){
        $http.get("/api/teams")
            .success(function(data) {
                $scope.teamData = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
      };

      $scope.getRotationTeam = function(id){
        $http.get("/api/teams/" + id)
            .success(function(data) {
                $scope.singleTeam = data;
                console.log('Success: ' + data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

      };

      $scope.pushTeamToRotation = function(){
          for(var i = 0; i < $scope.teamData.length; i++){
            $scope.teamData[i].day = i + 1;
            $scope.rotationData.day_schedule.push($scope.teamData[i]._id);
          }
        }

      $scope.getTeams();
}]);

app.controller("ActiveRotation",["$scope", "$http", function($scope, $http){

  $scope.getRotationByStatus = function(status){
    $http.get("/api/rotations/status/" + status)
        .success(function(data) {
            $scope.singleRotation = data;
            console.log('Success: ' + data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

  };

  $scope.getRotationByStatus('Active');

}]);

app.directive("rotations", function(){
    return{
      restrict: "E",
      templateUrl: "directives/rotations/rotations.html",
      controller: ["$scope", function($scope){
            $scope.rotationForm = false;
            $scope.rotationData = {};
            $scope.rotationData.day_schedule = [];


            this.resetForms = function(){
              $scope.rotationForm = false;
            };

            this.showRotationForm = function(value){
              return $scope.rotationForm == value;
            };

            this.setRotationForm = function(value){
                $scope.rotationForm = value;
            };
      }],
      controllerAs: "rotationFormCtrl"
    };
});

app.directive("rotationAdd", function(){
    return{
      restrict: "E",
      templateUrl: "directives/rotations/rotation-add.html",
    };
});

app.directive("rotationEdit", function(){
    return{
      restrict: "E",
      templateUrl: "directives/rotations/rotation-edit.html",
    };
});


}());
