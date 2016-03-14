angular.module('tic-tac-angular').directive('gameWrapper', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/projects/game/game.html',
    controllerAs: 'gameWrapper',
    controller: function($scope, $reactive , $state) {

    }
  };
});
