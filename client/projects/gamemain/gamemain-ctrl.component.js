angular.module('tic-tac-angular').directive('gameMain', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/projects/gamemain/gamemain.html',
    controllerAs: 'gameMain',
    controller: function($scope, $reactive, $modal, $state) {
      $reactive(this).attach($scope);

      var Games = this.subscribe('game');
      this.subscribe('users');
      this.myUser = Meteor.userId()
      this.helpers({
        projects: () => {
          return Game.find({
            invited: Meteor.userId()
          }).fetch();
        },
        CreatedMatches: () => {
          return Game.find({
            owner: Meteor.userId()
          }).fetch();
        },
        users: () => {
          return Meteor.users.find({});
        },
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        },
        currentUserId: () => {
          return Meteor.userId();
        }
      });

      this.openAddNewGameModal = function() {
        $modal.open({
          animation: true,
          template: '<add-new-game-modal></add-new-game-modal>',
          size: 'lg',
          windowClass: 'my-modal-popup'
        });
      };

      this.removeProject = (project) => {
        Game.remove({
          _id: project._id
        });
      };

      this.getProjectCreator = function(project) {
        if (!project) {
          return '';
        }
        let owner = Meteor.users.findOne(project.owner);
        if (!owner) {
          return 'nobody';
        }
        if (Meteor.userId() !== null && owner._id === Meteor.userId()) {
          return 'me';
        }
        return owner;
      };

      this.invitedUser = function(project) {
        if (!project) {
          return '';
        }
        let invited = Meteor.users.findOne(project.invited);
        if (!invited) {
          return 'nobody';
        }
        if (Meteor.userId() !== null && invited._id === Meteor.userId()) {
          return 'me';
        }
        return invited;
      };

      this.confirm = (gameId, reply) => {
        Meteor.call('confirm', gameId, reply, (error) => {
          if (error) {
            console.log('Oops, unable to confirm!');
          } else {
            console.log('confirm Done!');
          }
        });
      };

      this.getUserById = (userId) => {
        return Meteor.users.findOne(userId);
      };

    }
  }
});
