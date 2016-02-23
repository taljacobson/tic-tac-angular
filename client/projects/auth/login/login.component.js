angular.module("tic-tac-angular").directive('login', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/projects/auth/login/login.html',
    controllerAs: 'login',
        controller: function ($scope, $reactive, $state, $modal) {
          $reactive(this).attach($scope);

          this.credentials = {
            email: '',
            password: ''
          };

          this.error = '';

          this.login = () => {
            Meteor.loginWithPassword(this.credentials.email, this.credentials.password, (err) => {
              if (err) {
                this.error = err;
              }
              else {
                $scope.$close();
              }
            });
          };

          this.openResetpwModal = function() {
            $scope.$close();
            $modal.open({
              animation: true,
              template: '<resetpw></resetpw>',
              windowClass: 'my-modal-popup'
            });
          };
        }
      };
    });
