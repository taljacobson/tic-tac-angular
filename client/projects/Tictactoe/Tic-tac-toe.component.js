angular.module('tic-tac-angular').directive('ticTacToe', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/projects/Tictactoe/Tic-tac-toe.html',
    controllerAs: 'TicTacToe',
    controller: function($scope, $reactive, $stateParams, $timeout) {
      $reactive(this).attach($scope);

      var Games = this.subscribe('game')
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
        },
        IsGameOver: () => {
          this.getReactively('this.game.turn')
          if (Games.ready()) {
            this.checkCells();
          }

        }
      });
      this.autorun(() => {
        this.getReactively('this.game.turn')
      });
      this.checkCells = () => {
        //  all the code that checks wining conditions should go here
        let match = this.game;
        let CellsArray = match.cells;
        //function that checks to see if there is a winner and who if
        //  [topLeft, top , topRight], [Left, center, Right] , [bottomLeft, bottom, BottomRight],
        //  [topLeft, Left , bottomLeft], [top, center, bottom], [topRight, Right, BottomRight],`
        //  [topLeft, center, bottomRight], [topRight, center,bottomLeft]
        //add score and reset game
        if (CellsArray.Top != null) {
          if ((CellsArray.TopLeft == CellsArray.Top) && (CellsArray.Top == CellsArray.TopRight)) {
            console.log("Top row match ")
            this.wininngCells('TopLeft', 'Top', 'TopRight')

          }
        }
        if (CellsArray.Center != null) {
          if ((CellsArray.Left == CellsArray.Center) && (CellsArray.Center == CellsArray.Right)) {
            console.log("Center row match ");
            this.wininngCells('Left', 'Center', 'Right');

          }
        }
        if (CellsArray.Bottom != null) {
          if ((CellsArray.BottomLeft == CellsArray.Bottom) && (CellsArray.Bottom == CellsArray.BottomRight)) {
            this.wininngCells('BottomLeft', 'Bottom', 'BottomRight')
            console.log("Bottom row match ")
          }
        }
        if (CellsArray.Left != null) {
          if ((CellsArray.BottomLeft == CellsArray.Left) && (CellsArray.Left == CellsArray.TopLeft)) {
            this.wininngCells('BottomLeft', 'Left', 'TopLeft')
            console.log("Left Col match ")
          }
        }
        if (CellsArray.Bottom != null) {
          if ((CellsArray.Top == CellsArray.Bottom) && (CellsArray.Bottom == CellsArray.Center)) {
            this.wininngCells('Top', 'Bottom', 'Center')
            console.log("Center col match ")
          }
        }
        if (CellsArray.Right != null) {
          if ((CellsArray.BottomRight == CellsArray.Right) && (CellsArray.Right == CellsArray.TopRight)) {
            this.wininngCells('BottomRight', 'Right', 'TopRight')
            console.log("Right col match ")
          }
        }
        if (CellsArray.Center != null) {
          if ((CellsArray.BottomLeft == CellsArray.Center) && (CellsArray.Center == CellsArray.TopRight)) {
            console.log("forword slas match ")
            this.wininngCells('BottomLeft', 'Center', 'TopRight')
          }
        }
        if (CellsArray.Center != null) {
          if ((CellsArray.TopLeft == CellsArray.Center) && (CellsArray.Center == CellsArray.BottomRight)) {
            console.log("back slas match ");
            this.wininngCells('TopLeft', 'Center', 'BottomRight')
          }
        }
        if ((CellsArray.TopLeft && CellsArray.Top && CellsArray.TopRight && CellsArray.Right && CellsArray.Center && CellsArray.Left && CellsArray.BottomLeft && CellsArray.Bottom && CellsArray.BottomRight) != null) {
          Meteor.call('Reset', this.game._id)
        }
      };

      // function that takes the onclick with an arg of cell.
      // cell a ng-reapeat value of the cells array that gets
      this.cellPicker = (cell, currentUser) => {
        if (this.game.cells[cell] == null) {
          Meteor.call('isOwner', this.game._id, currentUser._id, cell, (error) => {
            if (error) {
              console.log('Oops, unable to error! ' + error);
            }
          });
        } else {
          console.log("this is already pressed")
        }
      }

      // function to highLight the wining cells
      this.wininngCells = (cell1, cell2, cell3) => {
        $("." + cell1 + "").children().addClass("blink");
        $("." + cell2 + "").children().addClass("blink");
        $("." + cell3 + "").children().addClass("blink");
        // Meteor.call('scoreAssing', this.game._id, cell1);
        // removes the highLight
        $timeout( () => {
          // remove the animation class
          $('.square').children().removeClass('blink');
          Meteor.call('scoreAssing', this.game._id, cell1);
        }, 900);

      }

      // resets the game
      this.reset = () => {
        Meteor.call('Reset', this.game._id)
      }

    }
  }
});
