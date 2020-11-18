var board = Chessboard('myBoard');
var $board = $('#myBoard');
var game = new Chess();
var whiteSquareGrey = '#a9a9a9';
var blackSquareGrey = '#696969';
var $status = $('#status');
var $fen = $('#fen');
var $pgn = $('#pgn');
var squareClass = 'square-55d63'
var squareToHighlight = null;
var colorToHighlight = null;

var gameIdValue;
var boardIdValue;
var prevBoardIdValue;

var config = {
    draggable: true,
    //position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
}

function loadAllGames(){
  $.ajax({
    url:'http://localhost:8080/api/gameIds',
    method: 'GET',
    success: function(data){
        console.log("load game successful");
        console.log(data);
        console.log(data.length);
        for(let i =0; i<data.length;i++){
          let entry = '<option value="'+data[i]+'">'+data[i]+'</option>';
          $("select").append(entry);
        }
        
    }
  })
}

function loadGameById(){
  let gameId = $("#games").val();
  $.ajax({
    url:'http://localhost:8080/api/game/'+gameId,
    method:'GET',
    success: function(data){
      console.log("load game successful");
      console.log(data);
      boardIdValue = data.boardId;
      gameIdValue = data.gameId;
      
      retrieveBoard(boardIdValue);  
    }
  })

  
}

function beginGame(){
    $.ajax({
        url:'http://localhost:8080/api/begin',
        method: 'POST',
        success: function(data){
            console.log("begin game successful");
            console.log(data);
            boardIdValue = data.boardId;
            gameIdValue = data.gameId;
            let entry = '<option value="'+data.gameId+'">'+data.gameId+'</option>';
            $("select").append(entry);
            retrieveBoard(boardIdValue);  
        }
    })
}

function retrieveBoard( boardId ){
    $.ajax({
        url:'http://localhost:8080/api/board/'+boardId,
        method:'GET',
        success: function( data ){
            console.log("retrieved board");
            console.log(data);
            gameIdValue = data.gameId;
            boardIdValue = data.boardId;
            prevBoardIdValue = data.prevBoardIdValue;
            stateValue = data.state;
            let inputPosition = data.state.split(" ")[0];
            console.log(inputPosition)
            game = new Chess(data.state.trim());
            board = Chessboard('myBoard', config)
            board.position(inputPosition);
            updateStatus();
        }
    })
}

function removeHighlights (color) {
    $board.find('.' + squareClass)
      .removeClass('highlight-' + color);
}
  

function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function onMouseoverSquare (square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
        square: square,
        verbose: true
    })

    // exit if there are no moves available for this square
    if (moves.length === 0) return

    // highlight the square they moused over
    greySquare(square)

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to)
    }
}

function onMouseoutSquare (square, piece) {
    removeGreySquares()
}


function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
    removeGreySquares();
    
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  if (game.turn() === 'b') {
    // highlight white's move
    removeHighlights('white');
    $board.find('.square-' + source).addClass('highlight-white');
    $board.find('.square-' + target).addClass('highlight-white');
  } else{
      // highlight black's move
    removeHighlights('black');
    $board.find('.square-' + source).addClass('highlight-black');
    $board.find('.square-' + target).addClass('highlight-black');
  }
  sendMoveRequest();
  updateStatus();
}

function sendMoveRequest(){
    let input = {};
    input.gameId = gameIdValue;
    input.boardId = boardIdValue;
    input.newState = game.fen();

    console.log("sending input: ")
    console.log(input);
    $.ajax({
        url:'http://localhost:8080/api/makeMove',
        method: 'POST',
        contentType:'application/json',
        
        data: JSON.stringify(input),
        success: function(data){
            console.log("make move successful");
            console.log(data);
            boardIdValue = data.boardId;
            gameIdValue = data.gameId;
            if(data.state != game.fen()){
                console.log(data.state);
                console.log(game.fen());
                alert("returned board doesn't match game data");
            }
            else{
                console.log("data match");
            }
            
        }
    })
}

function undoMove(){
  if(!game.game_over()){
    game.undo();
    board.position(game.fen());
    let input = {};
    input.gameId = gameIdValue;
    input.boardId = boardIdValue;
    input.newState = game.fen();

    console.log("sending input: ")
    console.log(input);
    $.ajax({
        url:'http://localhost:8080/api/undoMove',
        method: 'POST',
        contentType:'application/json',
        
        data: JSON.stringify(input),
        success: function(data){
            console.log("undo move successful");
            console.log(data);
            boardIdValue = data.boardId;
            gameIdValue = data.gameId;
            if(data.state.trim() != game.fen().trim()){
                console.log(data.state);
                console.log(game.fen());
                alert("returned board doesn't match game data");
            }
            else{
                console.log("data match");
            }
        }
    })
    updateStatus();
  }
  else{
    console.log("can't undo move. game is already over.");
  }
}


// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''
  
  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
    
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}

//$('#clearBoardBtn').on('click', board.clear)

function clearBoard(){
  
    removeHighlights('white');
    removeHighlights('black');
    board.clear();
    
}