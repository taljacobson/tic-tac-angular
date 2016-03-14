Game = new Mongo.Collection('game');


Game.allow({
  insert: function(userId, project) {
    return userId && project.owner === userId;
  },
  update: function(userId, project, fields, modifier) {
    return userId && (project.owner === userId || project.invited === userId);
  },
  remove: function(userId, project) {
    return userId && (project.owner === userId || project.invited === userId);
  }
});

let cells = {
  'TopLeft': null,
  'Top': null,
  'TopRight': null,
  'Left': null,
  'Center': null,
  'Right': null,
  'BottomLeft': null,
  'Bottom': null,
  'BottomRight': null
};

Meteor.methods({
  scoreAssing: function(matchId, cell) {
    check(matchId, String);
    check(cell, String);
    let match = Game.findOne(matchId);

    if (!match)
      throw new Meteor.Error(404, "No such match!");

    if (!cell)
      throw new Meteor.Error(404, "No such cell!");

    if (!Meteor.userId())
      throw new Meteor.Error("not-authorized");

    let matchCells = match.cells;
    let theCell = matchCells[cell];

    if (theCell == 'X') {
      if (Meteor.isServer) {
        Game.update(matchId, {
          $inc: {
            xWins: 1
          },
          $set: {
            cells
          }
        });
      } else {
        Game.update(matchId, {
          $inc: {
            xWins: 1
          },
          $set: {
            cells
          }
        });
      }
    }
    if (theCell == 'O') {
      if (Meteor.isServer) {
        Game.update(matchId, {
          $inc: {
            oWins: 1
          },
          $set: {
            cells
          }
        });
      } else {
        Game.update(matchId, {
          $inc: {
            oWins: 1
          },
          $set: {
            cells
          }
        });
      }
    }
  },
  Reset: function(matchId) {
    check(matchId, String);
    let match = Game.findOne(matchId);

    if (!match)
      throw new Meteor.Error(404, "No such match!");

    if (!Meteor.userId())
      throw new Meteor.Error("not-authorized");

    if (Meteor.isServer) {
      Game.update(matchId, {
        $set: {
          cells
        }
      });
    } else {
      Game.update(matchId, {
        $set: {
          cells
        }
      });
    }
  },
  isOwner: function(matchId, userId, cell) {
    // call function that checks who you are and if its your turn
    check(matchId, String);
    check(userId, String);
    check(cell, String);
    // binds the cell you from the tic tac toe game
    let cellname = "cells." + cell;

    // binds the specesific match to the match variable
    let match = Game.findOne(matchId);
    setCell = function(player, cell) {
      // creates a index of how many items, if any, to cellIndex
      //let cellIndex = _.indexOf(_.pluck(match.cells, [cellname]), player);
      //console.log(cellIndex)
      // take the result of the turn object value and inverts its value, true to false
      let unTurn = !match.turn;
      if (match.cells[cell] != null) {
        return console.log("this already exists");
      } else {
        if (Meteor.isServer) {
          Game.update(matchId, {
            $set: {
              "turn": unTurn,
              [cellname]: player
            }
          });
        } else {
          Game.update(matchId, {
            $set: {
              "turn": unTurn,
              [cellname]: player
            }
          });
        }

      }
    };
    // checks to see if there is a match by that name
    if (!match)
      throw new Meteor.Error(404, "No such match!");
    // checks if you are logged in
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in to play");
    // makes sure that it got a cell
    if (!cell)
      throw new Meteor.Error(404, "No such cell!");

    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    if (userId == (!match.owner || !match.invited))
      throw new meteor.Error("not-authorized");

    // calls the SetCell function if you are not the creater of the match and turn is set to false, sets you as O
    if (userId === match.invited && match.turn !== true) {
      player = 'O';
      setCell(player);
    }
    //  calls the SetCell function if you are the creater of the match and turn is set to true, sets you as X
    if (userId === match.owner && match.turn === true) {
      player = 'X';
      setCell(player);
    }
  },
  invite: function(matchId, userId) {
    check(matchId, String);
    check(userId, String);
    let match = Game.findOne(matchId);

    if (!match)
      throw new Meteor.Error(404, "No such match!");

    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    if (match.owner !== this.userId)
      throw new Meteor.Error(404, "No permissions!");

    if (userId !== match.owner && !_.contains(match.invited, userId)) {
      Game.update(matchId, {
        $set: {
          invited: userId
        }
      });
    }
  },
  confirm: function(matchId, reply) {
    check(matchId, String);
    check(reply, String);

    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in to RSVP");

    if (!_.contains(['confirm', 'decline'], reply))
      throw new Meteor.Error(400, "Invalid entry");

    let match = Game.findOne(matchId);

    if (!match)
      throw new Meteor.Error(404, "No such match");

    if (this.userId == match.owner)
      throw new Meteor.Error(404, "you are the creater no need to confirm your self");

    if (this.userId != match.invited)
      throw new Meteor.Error(404, "you where not invited");

    if (reply == 'confirm') {
      if (Meteor.isServer) {
        Game.update({
          _id: matchId,
        }, {
          $set: {
            "confirm": true
          }
        });
      }
    }

    if (reply == 'decline') {
      if (Meteor.isServer) {
        Game.remove({
          _id: matchId
        });
      }
    }
  }
});
