import { PieceType, Coord } from "../../game-definitions/GameData";
import { Move } from "../../game-definitions/game-interface/Move";
//import { Square } from "../../game-definitions/game-interface/Square";
import { BoardSquare } from "../../game-definitions/game-object/BoardSquare";
import { SquareComponent } from 'src/app/square/square.component';

export function whitePawnPotentialMoves(pos: SquareComponent): Move[] {

    //4 possible cases

    //capture is possible diagonally
    //we can move forward 1
    //if we're on the 2nd row we can move forward 2
    //      we need to record the enPassant capture square
    //      that is 1 row behind the new position
    //if we move to the 8th row we can promote

    const toReturn: Move[] = [];
    if (pos.row === 6) {
        //we will promote if we move forward
        for( let promotePiece : PieceType = PieceType.Knight; promotePiece < PieceType.King; promotePiece++ ){
            let toPromote = new SquareComponent();
            toPromote.row = pos.row+1 as Coord;
            toPromote.col = pos.col;
            //move 1
            const singleMove: Move = {
                from: pos,
                to: toPromote,
                promoteTo: promotePiece
            };

            toReturn.push(singleMove);

            if (pos.col > 0) {
                let toLeftCapture = new SquareComponent();
                toLeftCapture.row = pos.row + 1 as Coord;
                toLeftCapture.col = pos.col - 1 as Coord;
                const leftCapture: Move = {
                    from: pos,
                    to: toLeftCapture,
                    mustCapture: true,
                    promoteTo: promotePiece
                }

                toReturn.push(leftCapture);
            }

            if (pos.col < 7) {
                let toRightCapture = new SquareComponent();
                toRightCapture.row = pos.row + 1 as Coord;
                toRightCapture.col = pos.col + 1 as Coord;
                const rightCapture: Move = {
                    from: pos,
                    to: toRightCapture,
                    mustCapture: true,
                    promoteTo: promotePiece
                }

                toReturn.push(rightCapture);
            }
        }

    }
    else {
        
        
        if (pos.row === 1) {
            let toDoubleMove = new SquareComponent();
            toDoubleMove.row = pos.row+2 as Coord;
            toDoubleMove.col = pos.col;

            let enPassantSquare = new SquareComponent();
            enPassantSquare.row = pos.row+1 as Coord;
            enPassantSquare.col = pos.col;

            const doubleMove: Move = {
                from: pos,
                to: toDoubleMove,
                enPassant: enPassantSquare
            };

            toReturn.push(doubleMove);
        }
        let toSingleMove = new SquareComponent();
        toSingleMove.row = pos.row+1 as Coord;
        toSingleMove.col = pos.col;
        //move 1
        const singleMove: Move = {
            from: pos,
            to: toSingleMove
        };
        toReturn.push(singleMove);

        
        if (pos.col > 0) {
            let toLeftCapture = new SquareComponent();
            toLeftCapture.row = pos.row + 1 as Coord;
            toLeftCapture.col = pos.col - 1 as Coord
            const leftCapture: Move = {
                from: pos,
                to: toLeftCapture,
                mustCapture: true
            }

            toReturn.push(leftCapture);
        }

        if (pos.col < 7) {
            let toRightCapture = new SquareComponent();
            toRightCapture.row = pos.row + 1 as Coord;
            toRightCapture.col = pos.col + 1 as Coord
            const rightCapture: Move = {
                from: pos,
                to: toRightCapture,
                mustCapture: true
            }

            toReturn.push(rightCapture);
        }
    }
    return toReturn;
}

export function blackPawnPotentialMoves(pos: SquareComponent): Move[] {

    //4 possible cases

    //capture is possible diagonally
    //we can move forward 1
    //if we're on the 2nd row we can move forward 2
    //      we need to record the enPassant capture square
    //      that is 1 row behind the new position
    //if we move to the 8th row we can promote

    const toReturn: Move[] = [];
    if (pos.row === 1) {

        for( let promotePiece : PieceType = PieceType.Knight; promotePiece < PieceType.King; promotePiece++ ){
            let toPromote = new SquareComponent();
            toPromote.row = pos.row-1 as Coord;
            toPromote.col = pos.col;
            //move 1
            const singleMove: Move = {
                from: pos,
                to: toPromote,
                promoteTo: promotePiece
            };

            toReturn.push(singleMove);
            
            if (pos.col > 0) {
                let toLeftCapture = new SquareComponent();
                toLeftCapture.row = pos.row-1 as Coord;
                toLeftCapture.col = pos.col-1 as Coord;
                const leftCapture: Move = {
                    from: pos,
                    to: toLeftCapture,
                    mustCapture: true,
                    promoteTo: promotePiece
                }

                toReturn.push(leftCapture);
            }

            if (pos.col < 7) {
                let toRightCapture = new SquareComponent();
                toRightCapture.row = pos.row-1 as Coord;
                toRightCapture.col = pos.col+1 as Coord;
                const rightCapture: Move = {
                    from: pos,
                    to: toRightCapture,
                    mustCapture: true,
                    promoteTo: promotePiece
                }

                toReturn.push(rightCapture);
            }
        }
    }
    else {
        
        
        if (pos.row === 6) {
            let toDoubleMove = new SquareComponent();
            toDoubleMove.row = pos.row-2 as Coord;
            toDoubleMove.col = pos.col as Coord;
            let enPassantSquare = new SquareComponent();
            enPassantSquare.row = pos.row-1 as Coord;
            enPassantSquare.col = pos.col;
            const doubleMove: Move = {
                from: pos,
                to: toDoubleMove,
                enPassant: enPassantSquare
            };

            toReturn.push(doubleMove);
        }
        let toSingleMove = new SquareComponent();
        toSingleMove.row = pos.row-1 as Coord;
        toSingleMove.col = pos.col as Coord;
        //move 1
        const singleMove: Move = {
            from: pos,
            to: toSingleMove
        };

        toReturn.push(singleMove);

        if (pos.col > 0) {
            let toLeftCapture = new SquareComponent();
            toLeftCapture.row = pos.row-1 as Coord;
            toLeftCapture.col = pos.col-1 as Coord;
            const leftCapture: Move = {
                from: pos,
                to: toLeftCapture,
                mustCapture: true
            }

            toReturn.push(leftCapture);
        }

        if (pos.col < 7) {
            let toRightCapture = new SquareComponent();
            toRightCapture.row = pos.row-1 as Coord;
            toRightCapture.col = pos.col+1 as Coord;
            const rightCapture: Move = {
                from: pos,
                to: toRightCapture,
                mustCapture: true
            }
            toReturn.push(rightCapture);
        }
    }
    return toReturn;
}

export function bishopPotentialMoves(pos: SquareComponent): Move[]{

    const toReturn: Move[] = [];

    
    //top left 
    //col (-) rows (+)
    for( let offSet : number = 1; pos.col - offSet >= 0 && pos.row + offSet <= 7; offSet++ ){
        let toSquare = new SquareComponent();
        toSquare.row = pos.row + offSet as Coord;
        toSquare.col = pos.col - offSet as Coord;
        let move : Move = {
            from: pos,
            to: toSquare
        };
        
        toReturn.push( move );
    }
    console.log("top left added");
    console.log(toReturn);
    
    //top right
    //col (+) rows (+)
    for( let offSet : number = 1; pos.col + offSet <= 7 && pos.row + offSet <= 7; offSet++ ){
        let toSquare = new SquareComponent();
        toSquare.row = pos.row + offSet as Coord;
        toSquare.col = pos.col + offSet as Coord;
        let move : Move = {
            from: pos,
            to: toSquare
        };
        
        toReturn.push( move );
    }

    console.log("top right added");
    console.log(toReturn);

    //bottom left
    //col (-)  rows (-)
    for( let offSet : number = 1; pos.col - offSet >= 0 && pos.row - offSet >= 0; offSet++ ){
        let toSquare = new SquareComponent();
        toSquare.row = pos.row - offSet as Coord;
        toSquare.col = pos.col - offSet as Coord;
        let move : Move = {
            from: pos,
            to: toSquare
        };
        
        toReturn.push( move );
    }

    console.log("bottom left added");
    console.log(toReturn);

    //bottom right
    //col (+) row(-)
    for( let offSet : number = 1; pos.col + offSet <= 7 && pos.row - offSet >= 0; offSet++ ){
        let toSquare = new SquareComponent();
        toSquare.row = pos.row - offSet as Coord;
        toSquare.col = pos.col + offSet as Coord;
        let move : Move = {
            from: pos,
            to: toSquare
        };
        
        toReturn.push( move );
    }
    console.log("bottom right added");
    console.log(toReturn);

    return toReturn;
}

export function knightPotentialMoves(pos: SquareComponent): Move[]{
    let move1 = new SquareComponent();
        
    const toReturn: Move[] = [];
    move1.row = pos.row + 2 as Coord;
    move1.col = pos.col - 1 as Coord;
    //move1 : row + 2, col - 1
    let move: Move = {
        from: pos,
        to: move1
    };
    toReturn.push( move );
    
    let move2 = new SquareComponent();
    move2.row = pos.row + 2 as Coord;
    move2.col = pos.col + 1 as Coord;
    //move2 : row + 2, col + 1
    move = {
        from: pos,
        to: move2
    }
    toReturn.push( move );

    let move3 = new SquareComponent();
    move3.row = pos.row - 2 as Coord;
    move3.col = pos.col - 1 as Coord;
    //move3 : row - 2, col - 1
    move = {
        from: pos,
        to: move3
    }
    toReturn.push( move );

    let move4 = new SquareComponent();
    move4.row = pos.row - 2 as Coord;
    move4.col = pos.col + 1 as Coord;
    //move4 : row - 2, col + 1
    move = {
        from: pos,
        to: move4
    }
    toReturn.push( move );

    let move5 = new SquareComponent();
    move5.row = pos.row - 1 as Coord;
    move5.col = pos.col - 2 as Coord;
    //move5 : row - 1, col - 2
    move = {
        from: pos,
        to: move5
    }
    toReturn.push( move );

    let move6 = new SquareComponent();
    move6.row = pos.row + 1 as Coord;
    move6.col = pos.col - 2 as Coord;
    //move6 : row + 1, col - 2
    move = {
        from: pos,
        to: move6
    }
    toReturn.push( move );

    let move7 = new SquareComponent();
    move7.row = pos.row - 1 as Coord;
    move7.col = pos.col + 2 as Coord;
    //move7 : row - 1, col + 2
    move = {
        from: pos,
        to: move7
    }
    toReturn.push( move );

    let move8 = new SquareComponent();
    move8.row = pos.row + 1 as Coord;
    move8.col = pos.col + 2 as Coord;
    //move8 : row + 1, col + 2
    move = {
        from: pos,
        to: move8
    }
    toReturn.push( move );
    
    return movesWithinBoard(toReturn);
}

export function rookPotentialMoves(pos: SquareComponent): Move[]{

    
    const toReturn: Move[] = [];

    
    //up 
    //rows (+)
    for( let offSet : number = 1; pos.row + offSet <= 7; offSet++ ){
        let toSquare = new SquareComponent();
        toSquare.row = pos.row + offSet as Coord;
        toSquare.col = pos.col;
        let move : Move = {
            from: pos,
            to: toSquare     
        };
        
        toReturn.push( move );
    }
    console.log("top added");
    console.log(toReturn);
    //down
    //rows (-)
    for( let offSet : number = 1; pos.row - offSet >= 0; offSet++ ){
        let toSquare = new SquareComponent();
        toSquare.row = pos.row - offSet as Coord;
        toSquare.col = pos.col;
        let move : Move = {
            from: pos,
            to: toSquare
        };
        
        toReturn.push( move );
    }
    console.log("bottom added");
    console.log(toReturn);
    //left
    //col (-)
    for( let offSet : number = 1; pos.col - offSet >= 0 && pos.row <= 7; offSet++ ){
        let toSquare = new SquareComponent();
        toSquare.row = pos.row;
        toSquare.col = pos.col - offSet as Coord;
        let move : Move = {
            from: pos,
            to: toSquare
        };
        
        toReturn.push( move );
    }
    console.log("left added");
    console.log(toReturn);
    //right
    //col(+)
    for( let offSet : number = 1; pos.col + offSet <= 7 && pos.row <= 7; offSet++ ){
        let toSquare = new SquareComponent();
        toSquare.row = pos.row;
        toSquare.col = pos.col + offSet as Coord;
        let move : Move = {
            from: pos,
            to: toSquare
        };
        
        toReturn.push( move );
    }
    console.log("right added");
    console.log(toReturn);
    return toReturn;
}

export function kingPotentialMoves(pos: SquareComponent): Move[]{
    
    const toReturn: Move[] = [];
    let up = new SquareComponent();
    up.row = pos.row + 1 as Coord;
    up.col = pos.col;
    // up
    let move: Move = {
        from: pos,
        to: up
    };
    toReturn.push( move );

    let down = new SquareComponent();
    down.row = pos.row - 1 as Coord;
    down.col = pos.col;
    // down
    move = {
        from: pos,
        to: down
    };
    toReturn.push( move );

    let left = new SquareComponent();
    left.row = pos.row;
    left.col = pos.col -1 as Coord;
    // left
    move = {
        from: pos,
        to: left
    };
    toReturn.push( move );

    let right = new SquareComponent();
    right.row = pos.row;
    right.col = pos.col + 1 as Coord;
    // right
    move = {
        from: pos,
        to: right
    };
    toReturn.push( move );
    
    let topLeft = new SquareComponent();
    topLeft.row = pos.row + 1 as Coord;
    topLeft.col = pos.col - 1 as Coord;
    // top left
    move = {
        from: pos,
        to: topLeft
    };
    toReturn.push( move );

    let topRight = new SquareComponent();
    topRight.row = pos.row + 1 as Coord;
    topRight.col = pos.col + 1 as Coord;
    // top right
    move = {
        from: pos,
        to: topRight
    };
    toReturn.push( move );

    let bottomLeft = new SquareComponent();
    bottomLeft.row = pos.row - 1 as Coord;
    bottomLeft.col = pos.col - 1 as Coord;
    // bottom left
    move = {
        from: pos,
        to: bottomLeft
    };
    toReturn.push( move );

    let bottomRight = new SquareComponent();
    bottomRight.row = pos.row - 1 as Coord;
    bottomRight.col = pos.col + 1 as Coord;
    // bottom right
    move = {
        from: pos,
        to: bottomRight
    };
    toReturn.push( move );

    return movesWithinBoard(toReturn);
}

function movesWithinBoard(moves:Move[]):Move[]{
    const toReturn: Move[] = [];
    for(let move of moves){
        //checking if inside board
        if( move.to.row >= 0 && move.to.col >= 0 
            && move.to.row <= 7 && move.to.col <= 7 ){
            toReturn.push(move);
        }
    }
    return toReturn;
}