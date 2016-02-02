Meteor.publish("users", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1  }});
});

Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true }, { fields: { emails: 1, profile: 1 , status: 1} });
});
