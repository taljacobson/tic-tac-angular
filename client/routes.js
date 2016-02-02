angular.module("tic-tac-angular").config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('game', {
      url: '/',
      template: '<game-main></game-main>'
    })
    .state('match', {
      url: '/game/:gameId',
      template: '<tic-tac-toe></tic-tac-toe>',
      resolve: {
        currentUser: ($q) => {
          if (Meteor.userId() == null) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }
      }
    })
    .state('login', {
        url: '/login',
        template: '<login></login>'
      })
      .state('register', {
        url: '/register',
        template: '<register></register>'
      })
      .state('resetpw', {
        url: '/resetpw',
        template: '<resetpw></resetpw>'
      });


  $urlRouterProvider.otherwise("/");
}).run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      if (error === 'AUTH_REQUIRED') {
        $state.go('login');
      }
    });
  });
