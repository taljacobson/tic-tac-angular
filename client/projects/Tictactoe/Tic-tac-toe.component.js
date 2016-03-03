angular.module('tic-tac-angular').directive('ticTacToe', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/projects/Tictactoe/Tic-tac-toe.html',
    controllerAs: 'TicTacToe',
    controller: function($scope, $reactive, $stateParams, $timeout) {
      $reactive(this).attach($scope);

      var Games = this.subscribe('game');
      this.subscribe('userStatus');

      let board = $('.board');
      let squares = $('.square');

      this.helpers({
        game: () => {
          return Game.findOne({
            _id: $stateParams.gameId
          });
        },
        ownerOnline: () => {
          return Meteor.users.findOne({
            _id: this.getReactively('this.game.owner')
          });
        },
        inviteOnline: () => {
          return Meteor.users.findOne({
            _id: this.getReactively('this.game.invited')
          });
        }
      });

      this.checkCells = () => {

        items = ["TopLeft", "Top", "TopRight", "Left", "Center", "Right", "BottomLeft", "Bottom", "BottomRight"];

        let winArray = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6]
        ];

        //  all the code that checks wining conditions should go here
        let match = this.game;
        let CellsArray = match.cells;
        //function that checks to see if there is a winner and who if
        //  [topLeft, top , topRight], [Left, center, Right] , [bottomLeft, bottom, BottomRight],
        //  [topLeft, Left , bottomLeft], [top, center, bottom], [topRight, Right, BottomRight],`
        //  [topLeft, center, bottomRight], [topRight, center,bottomLeft]
        //add score and reset game
        if ((CellsArray.TopLeft && CellsArray.Top && CellsArray.TopRight && CellsArray.Right && CellsArray.Center && CellsArray.Left && CellsArray.BottomLeft && CellsArray.Bottom && CellsArray.BottomRight) !== null) {
          Meteor.call('Reset', this.game._id);
        } else {
          for (let i = 0; i < winArray.length; i++) {
            let winArrayLength = winArray[i].length;
            let cube = winArray[i];
            let first = items[cube[0]];
            let second = items[cube[1]];
            let third = items[cube[2]];
            if (CellsArray[second] !== null) {
              if ((CellsArray[first] == CellsArray[second]) && (CellsArray[second] == CellsArray[third])) {
                return this.wininngCells(first, second, third);
              }
            }
          }
        }
      };

      // function that takes the onclick with an arg of cell.
      // cell a ng-reapeat value of the cells array that gets
      this.cellPicker = (cell, currentUser) => {
        if (this.game.cells[cell] === null) {
          Meteor.call('isOwner', this.game._id, currentUser._id, cell, (error) => {
            if (error) {
              console.log('Oops, unable to error! ' + error);
            }
          });
        } else {
          console.log("this is already pressed");
        }
      };

      // function to highLight the wining cells
      this.wininngCells = (cell1, cell2, cell3) => {
        $("." + cell1 + "").children().addClass("blink");
        $("." + cell2 + "").children().addClass("blink");
        $("." + cell3 + "").children().addClass("blink");
        // Meteor.call('scoreAssing', this.game._id, cell1);
        // removes the highLight
        console.log("win");
        $timeout(() => {
          // remove the animation class
          $('.square').children().removeClass('blink');
          Meteor.call('scoreAssing', this.game._id, cell1);
        }, 900);

      };

      // resets the game
      this.reset = () => {
        Meteor.call('Reset', this.game._id);
      };

      this.autorun(() => {
        this.getReactively('this.game.turn');
        console.log("run");
        if (Games.ready()) {
          this.checkCells();
        }
      });

    }
  };
});
