 Meteor.publish("game", function() {
 	return Game.find({
	$or: [
      {
        $and: [
          {owner: this.userId},
          {owner: {$exists: true}}
        ]
      },
      {
        $and: [
          {invited: this.userId},
          {invited: {$exists: true}}
        ]
      }
    ]
 	});
 });
