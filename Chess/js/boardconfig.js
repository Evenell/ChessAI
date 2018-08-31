var board,
    game = new Chess();

//AI Part
var calculateBestMove = function(game) {
  var newGameMoves = game.moves();
  var bestMove = null;
  var bestValue = -99999;
  for (var i = 0; i < newGameMoves.length; i++) {
    var newGameMove = newGameMoves[i];
    game.move(newGameMove);

    var boardValue = -evaluateBoard(game);
    game.undo();

    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = newGameMove;
    }
  }
  return bestMove;
}
var evaluateBoard = function(game) {
  var total = 0;
  
  var string = game.fen();
  var index = 0;
  var curr = string.substring(index, index + 1);
  while(curr !== ' ') {
    total = total + getPieceValue(curr);
    index++;
    curr = string.substring(index, index + 1);
  }
  console.log(total);
  return total;
}

var getPieceValue = function(string) {
  var pieceValue = {
    'p' : 100,
    'n' : 350,
    'b' : 350,
    'r' : 525,
    'q' : 1000,
    'k' : 10000
  };
  if (pieceValue.hasOwnProperty(string)) {
    return pieceValue[string];
  }
  else return 0;
}
var makeMove = function() {
  var bestMove = calculateBestMove(game);
  game.move(bestMove);
  board.position(game.fen());
}
// Handles what to do after human makes move.
// Computer automatically makes next move
var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // If illegal move, snapback
  if (move === null) return 'snapback';

  // Log the move
  console.log(move)

  // make move for black
  window.setTimeout(function() {
    makeMove();
  }, 250);
};


// Actions after any move
var onMoveEnd = function(oldPos, newPos) {
  // Alert if game is over
  if (game.game_over() === true) {
    alert('Game Over');
    console.log('Game Over');
  }

  // Log the current game position
  console.log(game.fen());
};

// Check before pick pieces that it is white and game is not over
var onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true || piece.search(/^b/) !== -1) {
    return false;
  }
};

// Update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
};

// Configure board
var cfg = {
  draggable: true,
  position: 'start',
  // Handlers for user actions
  onMoveEnd: onMoveEnd,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = ChessBoard('board', cfg);