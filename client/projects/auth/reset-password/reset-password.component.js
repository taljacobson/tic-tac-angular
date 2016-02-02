angular.module("tic-tac-angular").directive('resetpw', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/projects/auth/reset-password/reset-password.html',
    controllerAs: 'resetpw',
    controller: function ($scope, $reactive, $state) {
      $reactive(this).attach($scope);

      this.credentials = {
        email: ''
      };

      this.error = '';

      this.reset = () => {
        Accounts.forgotPassword(this.credentials, (err) => {
          if (err) {
            this.error = err;
          }
          else {
            $state.go('game', {}, { reload: true });
          }
        });
      };
    }
  }
});
