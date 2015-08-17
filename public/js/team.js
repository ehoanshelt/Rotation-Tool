(function() {
'use strict';

var app = angular.module("teamApp", []);

app.controller("TeamController", ["$scope", "$http", function ($scope, $http) {

  // when landing on the page, get all todos and show them
  $http.get("/api/teams")
      .success(function(data) {
          $scope.teams = data;
          console.log(data);
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });

    this.resetForms = function(){
      $scope.teamForm = false;
      $scope.employeeForm = false;
    };

    $scope.getTeam = function(id){
      $http.get("/api/teams/" + id)
          .success(function(data) {
              $scope.singleTeam = data;
              console.log('Success: ' + data);
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });

    };

    $scope.updateTeam = function(id){
      $http.put("/api/teams/" + id, $scope.singleTeam[0])
          .success(function(data) {
              $scope.singleTeam = {};
              $scope.teams = data;
              console.log('Success: ' + data);
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });

    };

    // when submitting the add form, send the text to the node API
    $scope.createTeam = function() {
        $http.post("/api/teams", $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.formData.employees = [];
                $scope.teams = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTeam = function(id) {
        $http.delete("/api/teams/" + id)
            .success(function(data) {
                $scope.teams = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.getRotation = function() {
        $http.post("/api/rotations")
            .success(function(data) {
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}]);

app.directive("teamForms", function(){
     return{
        restrict: "E",
        templateUrl: "directives/team/team-forms.html",
        controller: ["$scope", function($scope){
            $scope.employee = {};
            $scope.teamForm = false;
            $scope.employeeForm = false;
            $scope.formData = {};
            $scope.formData.employees = [];

            this.showTeamForm = function(value){
              return $scope.teamForm == value;
            };

            this.setTeamForm = function(value){
                $scope.teamForm = value;
            };

            this.showEmployeeForm = function(value){
              return $scope.employeeForm == value;
            };

            this.setEmployeeForm = function(value){
                $scope.employeeForm = value;
            };

            $scope.addEmployee = function(dataSet){
              dataSet.employees.push($scope.employee);
              $scope.employee = {};
            };

            $scope.removeEmployee = function(dataSet, index){
              dataSet.employees.splice(index, 1);
            };
        }],
        controllerAs: "teamFormCtrl"
      };
});

app.directive("teamEditForm", function(){
     return{
        restrict: "E",
        templateUrl: "directives/team/team-edit.html"
      };
});

app.directive("teamAddForm", function(){
     return{
        restrict: "E",
        templateUrl: "directives/team/team-add.html"
      };
});
}());
