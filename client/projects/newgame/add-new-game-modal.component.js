angular.module('tic-tac-angular').directive('addNewGameModal', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/projects/newgame/add-new-game-modal.html',
    controllerAs: 'addNewGameModal',
    controller: function($scope, $stateParams, $reactive) {
      $reactive(this).attach($scope);

      var Games = this.subscribe('game');
      this.subscribe('userStatus');

      this.helpers({
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        },
        Online: () => {
          return Meteor.users.find({
            "status.online": true
          });
        }
      });

      this.newGame = {};

      // TODO -- Make this a call to the server, should not monipulate DB from client
      this.addGame = (Invited) => {
        this.newGame.createdAt = new Date();
        this.newGame.owner = Meteor.user()._id;
        this.newGame.turn = true;
        this.newGame.invited = Invited._id
        this.newGame.cells = {
          'TopLeft': null,
          'Top': null,
          'TopRight': null,
          'Left': null,
          'Center': null,
          'Right': null,
          'BottomLeft': null,
          'Bottom': null,
          'BottomRight': null
        }
        Game.insert(this.newGame);
        this.newGame = {};
        $scope.$close();
      };

    }
  }
})
