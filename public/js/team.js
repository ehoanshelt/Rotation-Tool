  (function() {
    'use strict';

    var app = angular.module("teamApp", ["ngMaterial"]);

    app.controller("TeamController", ["$scope", "$http", "$mdSidenav", "$mdBottomSheet", function($scope, $http, $mdSidenav, $mdBottomSheet) {
      $scope.employee = {};
      $scope.formData = {};
      $scope.formShow = false;
      $scope.formData.employees = [];

      // when landing on the page, get all todos and show them
      $http.get("/api/teams")
        .success(function(data) {
          $scope.teams = data;
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });

      $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
      };


      this.showAddTeam = function($event) {
        $mdBottomSheet.show({
          templateUrl: 'directives/team/team-add.html',
          targetEvent: $event,
          scope: $scope,
          preserveScope: true
        })
      };

      this.showEditTeam = function($event) {
        $mdBottomSheet.show({
          templateUrl: 'directives/team/team-edit.html',
          targetEvent: $event,
          scope: $scope,
          preserveScope: true
        })
      };

      this.setForm = function(id){
        $scope.formShow = id;
      }

      this.showForm = function(id){
        return $scope.formShow == id;
      }

      this.resetForms = function() {
        $scope.teamForm = false;
        $scope.employeeForm = false;
      };

      $scope.getTeam = function(id) {
        $http.get("/api/teams/" + id)
          .success(function(data) {
            $scope.singleTeam = data;
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
            $mdBottomSheet.hide();
            $scope.formData = {}; // clear the form so our user is ready to enter another
            $scope.formData.employees = [];
            $scope.teams = data;
            console.log(data);
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
      };

      $scope.updateTeam = function(id) {
        $http.put("/api/teams/" + id, $scope.singleTeam[0])
          .success(function(data) {
            $mdBottomSheet.hide();
            $scope.singleTeam = {};
            $scope.teams = data;
            console.log('Success: ' + data);
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

      $scope.addEmployee = function(dataSet) {
        dataSet.employees.push($scope.employee);
        $scope.employee = {};
      };

      $scope.removeEmployee = function(dataSet, index) {
        dataSet.employees.splice(index, 1);
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

    app.directive("teamEditForm", function() {
      return {
        restrict: "E",
        templateUrl: "directives/team/team-edit.html"
      };
    });
  }());
