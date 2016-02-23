angular.module('tic-tac-angular').filter('notMe', function() {
  return function(users) {
    return _.filter(users, function(user) {
      return (user._id != Meteor.userId());
    });
  };
});
