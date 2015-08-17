(function() {
'use strict';

var app = angular.module("rotationApp", ["teamApp"]);

app.controller("RotationController", ["$scope", "$http", function ($scope, $http) {
      var d = new Date("08/18/2015");
      $scope.dayOfWeek = d.getDay('08/18/2015');

      $http.get("/api/rotations")
          .success(function(data) {
              $scope.rotations = data;
              console.log(data);
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });

      $scope.getRotation = function(id){
        $http.get("/api/rotations/" + id)
            .success(function(data) {
                $scope.singleRotation = data;
                console.log('Success: ' + data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

      };

      $scope.createRotation = function() {
          $http.post("/api/rotations", $scope.rotationData)
              .success(function(data) {
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
}]);

app.directive("rotations", function(){
    return{
      restrict: "E",
      templateUrl: "directives/rotations/rotations.html",
      controller: ["$scope", function($scope){
            $scope.rotationForm = false;
            $scope.rotationData = {};
            $scope.rotationData.day_schedule = [];
            $scope.getTeams();


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


}());
