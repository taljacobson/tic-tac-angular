angular.module('tic-tac-angular').filter('uninvited', function() {
  return function(users, project) {
    if (!project) {
      return false;
    }

    return _.filter(users, function(user) {
      return !(user._id == project.owner || _.contains(project.invited, user._id));
    });
  };
});
