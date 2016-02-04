angular.module('tic-tac-angular').directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/projects/navbar/navbar.html',
    controllerAs: 'ticTacAngular',
    controller: function($scope, $reactive, $modal) {
      $reactive(this).attach($scope);

      this.helpers({
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        },
        currentUser: () => {
          return Meteor.user();
        }
      });
      this.logout = () => {
        Accounts.logout();
      }

      this.openLoginModal = function() {
        $modal.open({
          animation: true,
          template: '<login></login>',
        });
      };

      this.openRegisterModal = function() {
        $modal.open({
          animation: true,
          template: '<register></register>',
        });
      };

    }
  }
})
