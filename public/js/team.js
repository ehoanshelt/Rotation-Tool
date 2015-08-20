(function() {
  'use strict';

  var app = angular.module("teamApp", ["ngMaterial"]);

  app.controller("TeamController", ["$scope", "$http", "$mdSidenav", function($scope, $http, $mdSidenav) {

    // when landing on the page, get all todos and show them
    $http.get("/api/teams")
      .success(function(data) {
        $scope.teams = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

    $scope.toggleSidenav = function(menuId) {
      $mdSidenav(menuId).toggle();
    };

    this.resetForms = function() {
      $scope.teamForm = false;
      $scope.employeeForm = false;
    };

    this.getTeam = function(id) {
      $http.get("/api/teams/" + id)
        .success(function(data) {
          $scope.singleTeam = data;
          console.log('Success: ' + data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });

    };

    this.updateTeam = function(id) {
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
    this.createTeam = function() {
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
    this.deleteTeam = function(id) {
      $http.delete("/api/teams/" + id)
        .success(function(data) {
          $scope.teams = data;
          console.log(data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

    this.getRotation = function() {
      $http.post("/api/rotations")
        .success(function(data) {
          console.log(data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

  }]);

  app.directive("teamForms", ["$mdBottomSheet", function($mdBottomSheet) {
    return {
      restrict: "E",
      templateUrl: "directives/team/team-forms.html",
      controller: ["$scope", function($scope) {
        $scope.employee = {};
        $scope.teamForm = false;
        $scope.employeeForm = false;
        $scope.formData = {};
        $scope.formData.employees = [];

        $scope.showListBottomSheet = function($event) {

          $mdBottomSheet.show({
            templateUrl: 'directives/team/team-add.html',
            targetEvent: $event
          });
        };

        this.showTeamForm = function(value) {
          return $scope.teamForm == value;
        };

        this.setTeamForm = function(value) {
          $scope.teamForm = value;
        };

        this.showEmployeeForm = function(value) {
          return $scope.employeeForm == value;
        };

        this.setEmployeeForm = function(value) {
          $scope.employeeForm = value;
        };

        $scope.addEmployee = function(dataSet) {
          dataSet.employees.push($scope.employee);
          $scope.employee = {};
        };

        $scope.removeEmployee = function(dataSet, index) {
          dataSet.employees.splice(index, 1);
        };
      }],
      controllerAs: "teamFormCtrl"
    };
  }]);

  app.directive("teamEditForm", function() {
    return {
      restrict: "E",
      templateUrl: "directives/team/team-edit.html"
    };
  });

  app.directive("teamAddForm", function() {
    return {
      restrict: "E",
      templateUrl: "directives/team/team-add.html"
    };
  });
}());
