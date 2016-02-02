angular.module('tic-tac-angular').directive('ticTacAngular', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/projects/footer/tic-tac-angular.html',
    controllerAs: 'ticTacAngular',
    controller: function($scope, $reactive, $modal) {
      $reactive(this).attach($scope);

      // this.helpers({
      //   isLoggedIn: () => {
      //     return Meteor.userId() !== null;
      //   },
      //   currentUser: () => {
      //     return Meteor.user();
      //   }
      // });
      // this.logout = () => {
      //   Accounts.logout();
      // }

    }
  }
})
