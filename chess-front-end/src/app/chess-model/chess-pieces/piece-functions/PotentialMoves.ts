import { PieceType, Coord } from "../../game-definitions/GameData";
import { Move } from "../../game-definitions/game-interface/Move";
import { Square } from "../../game-definitions/game-interface/Square";
import { BoardSquare } from "../../game-definitions/game-object/BoardSquare";

export function whitePawnPotentialMoves(pos: Square): Move[] {

    //4 possible cases

    //capture is possible diagonally
    //we can move forward 1
    //if we're on the 2nd row we can move forward 2
    //      we need to record the enPassant capture square
    //      that is 1 row behind the new position
    //if we move to the 8th row we can promote

    const toReturn: Move[] = [];
    if (pos.row === 6) {

        for( let promotePiece : PieceType = PieceType.Knight; promotePiece < PieceType.King; promotePiece++ ){

        

            //move 1
            const singleMove: Move = {
                from: pos,
                to: new BoardSquare((pos.row + 1 as Coord), pos.col),
                promoteTo: promotePiece
            };

            toReturn.push(singleMove);

            if (pos.col > 0) {
                const leftCapture: Move = {
                    from: pos,
                    to: new BoardSquare((pos.row + 1 as Coord), (pos.col - 1 as Coord)),
                    mustCapture: true,
                    promoteTo: promotePiece
                }

                toReturn.push(leftCapture);
            }

            if (pos.col < 7) {
                const rightCapture: Move = {
                    from: pos,
                    to: new BoardSquare((pos.row + 1 as Coord), (pos.col + 1 as Coord)),
                    mustCapture: true,
                    promoteTo: promotePiece
                }

                toReturn.push(rightCapture);
            }
        }



    }
    else {

        if (pos.row === 1) {


            const doubleMove: Move = {
                from: pos,
                to: new BoardSquare((pos.row + 2 as Coord), pos.col),
                enPassant: new BoardSquare((pos.row + 1 as Coord), pos.col)
            };

            toReturn.push(doubleMove);
        }

        //move 1
        const singleMove: Move = {
            from: pos,
            to: new BoardSquare((pos.row + 1 as Coord), pos.col)
        };

        toReturn.push(singleMove);

        if (pos.col > 0) {
            const leftCapture: Move = {
                from: pos,
                to: new BoardSquare((pos.row + 1 as Coord), (pos.col - 1 as Coord)),
                mustCapture: true
            }

            toReturn.push(leftCapture);
        }

        if (pos.col < 7) {
            const rightCapture: Move = {
                from: pos,
                to: new BoardSquare((pos.row + 1 as Coord), (pos.col + 1 as Coord)),
                mustCapture: true
            }

            toReturn.push(rightCapture);
        }


        //we will promote if we move forward
    }



    return toReturn;

}

export function blackPawnPotentialMoves(pos: Square): Move[] {

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

        

            //move 1
            const singleMove: Move = {
                from: pos,
                to: new BoardSquare((pos.row - 1 as Coord), pos.col),
                promoteTo: promotePiece
            };

            toReturn.push(singleMove);

            if (pos.col > 0) {
                const leftCapture: Move = {
                    from: pos,
                    to: new BoardSquare((pos.row - 1 as Coord), (pos.col - 1 as Coord)),
                    mustCapture: true,
                    promoteTo: promotePiece
                }

                toReturn.push(leftCapture);
            }

            if (pos.col < 7) {
                const rightCapture: Move = {
                    from: pos,
                    to: new BoardSquare((pos.row - 1 as Coord), (pos.col + 1 as Coord)),
                    mustCapture: true,
                    promoteTo: promotePiece
                }

                toReturn.push(rightCapture);
            }
        }



    }
    else {

        if (pos.row === 6) {


            const doubleMove: Move = {
                from: pos,
                to: new BoardSquare((pos.row - 2 as Coord), pos.col),
                enPassant: new BoardSquare((pos.row - 1 as Coord), pos.col)
            };

            toReturn.push(doubleMove);
        }

        //move 1
        const singleMove: Move = {
            from: pos,
            to: new BoardSquare((pos.row - 1 as Coord), pos.col)
        };

        toReturn.push(singleMove);

        if (pos.col > 0) {
            const leftCapture: Move = {
                from: pos,
                to: new BoardSquare((pos.row - 1 as Coord), (pos.col - 1 as Coord)),
                mustCapture: true
            }

            toReturn.push(leftCapture);
        }

        if (pos.col < 7) {
            const rightCapture: Move = {
                from: pos,
                to: new BoardSquare((pos.row - 1 as Coord), (pos.col + 1 as Coord)),
                mustCapture: true
            }

            toReturn.push(rightCapture);
        }


        //we will promote if we move forward
    }



    return toReturn;

}

export function bishopPotentialMoves(pos: Square): Move[]{

    const toReturn: Move[] = [];

    
    //top left 
    //col (-) rows (+)
    for( let offSet : number = 1; pos.col - offSet >= 0 && pos.row + offSet <= 7; offSet++ ){
        let move : Move = {
            from: pos,
            to: new BoardSquare( (pos.row + offSet as Coord) , (pos.col - offSet as Coord ))     
        };
        
        toReturn.push( move );
    }

    //top right
    //col (+) rows (+)
    for( let offSet : number = 1; pos.col + offSet >= 0 && pos.row + offSet <= 7; offSet++ ){
        let move : Move = {
            from: pos,
            to: new BoardSquare( (pos.row + offSet as Coord) , (pos.col + offSet as Coord ))     
        };
        
        toReturn.push( move );
    }

    //bottom left
    //col (-)  rows (-)
    for( let offSet : number = 1; pos.col - offSet >= 0 && pos.row - offSet <= 7; offSet++ ){
        let move : Move = {
            from: pos,
            to: new BoardSquare( (pos.row - offSet as Coord) , (pos.col - offSet as Coord ))     
        };
        
        toReturn.push( move );
    }

    //bottom right
    //col (+) row(-)
    for( let offSet : number = 1; pos.col + offSet >= 0 && pos.row - offSet <= 7; offSet++ ){
        let move : Move = {
            from: pos,
            to: new BoardSquare( (pos.row - offSet as Coord) , (pos.col + offSet as Coord ))     
        };
        
        toReturn.push( move );
    }

    return toReturn;
}

export function knightPotentialMoves(pos: Square): Move[]{

    const toReturn: Move[] = [];

    //move1 : col - 1 , row + 2
    let move: Move = {
        from: pos,
        to: new BoardSquare(( pos.row + 2 as Coord ), ( pos.col - 1 as Coord ))
    };
    toReturn.push( move );
    
    //move2 : col + 1 , row + 2
    move = {
        from: pos,
        to: new BoardSquare(( pos.row + 2 as Coord) , (pos.col + 1 as Coord) )
    }
    toReturn.push( move );

    //move3 : col - 1 , row - 2
    move = {
        from: pos,
        to: new BoardSquare(( pos.row - 2 as Coord) , (pos.col - 1 as Coord) )
    }
    toReturn.push( move );

    //move4 : col + 1 , row - 2
    move = {
        from: pos,
        to: new BoardSquare(( pos.row - 2 as Coord) , (pos.col + 1 as Coord) )
    }
    toReturn.push( move );

    //move5 : col - 2 , row - 1
    move = {
        from: pos,
        to: new BoardSquare(( pos.row - 1 as Coord) , (pos.col - 2 as Coord) )
    }
    toReturn.push( move );

    //move6 : col - 2 , row + 1
    move = {
        from: pos,
        to: new BoardSquare(( pos.row + 1 as Coord) , (pos.col - 2 as Coord) )
    }
    toReturn.push( move );

    //move7 : col + 2 , row - 1
    move = {
        from: pos,
        to: new BoardSquare(( pos.row - 1 as Coord) , (pos.col + 2 as Coord) )
    }
    toReturn.push( move );

    //move8 : col + 2 , row + 1
    move = {
        from: pos,
        to: new BoardSquare(( pos.row + 1 as Coord) , (pos.col + 2 as Coord) )
    }
    toReturn.push( move );
    
    return movesWithinBoard(toReturn);
}

export function rookPotentialMoves(pos: Square): Move[]{

    const toReturn: Move[] = [];

    
    //up 
    //rows (+)
    for( let offSet : number = 1; pos.row + offSet <= 7; offSet++ ){
        let move : Move = {
            from: pos,
            to: new BoardSquare( (pos.row + offSet as Coord) , (pos.col as Coord ))     
        };
        
        toReturn.push( move );
    }

    //down
    //rows (-)
    for( let offSet : number = 1; pos.row - offSet <= 7; offSet++ ){
        let move : Move = {
            from: pos,
            to: new BoardSquare( (pos.row - offSet as Coord) , (pos.col as Coord ))     
        };
        
        toReturn.push( move );
    }

    //left
    //col (-)
    for( let offSet : number = 1; pos.col - offSet >= 0 && pos.row <= 7; offSet++ ){
        let move : Move = {
            from: pos,
            to: new BoardSquare( (pos.row as Coord) , (pos.col - offSet as Coord ))     
        };
        
        toReturn.push( move );
    }

    //right
    //col(+)
    for( let offSet : number = 1; pos.col + offSet >= 0 && pos.row <= 7; offSet++ ){
        let move : Move = {
            from: pos,
            to: new BoardSquare( (pos.row as Coord) , (pos.col + offSet as Coord ))     
        };
        
        toReturn.push( move );
    }

    return toReturn;
}

export function kingPotentialMoves(pos: Square): Move[]{
    
    const toReturn: Move[] = [];
    
    // up
    let move: Move = {
        from: pos,
        to: new BoardSquare(( pos.row + 1 as Coord ), ( pos.col as Coord ))
    };
    toReturn.push( move );

    // down
    move = {
        from: pos,
        to: new BoardSquare(( pos.row - 1 as Coord ), ( pos.col as Coord ))
    };
    toReturn.push( move );

    // left
    move = {
        from: pos,
        to: new BoardSquare(( pos.row as Coord ), ( pos.col - 1 as Coord ))
    };
    toReturn.push( move );

    // right
    move = {
        from: pos,
        to: new BoardSquare(( pos.row as Coord ), ( pos.col + 1 as Coord ))
    };
    toReturn.push( move );
    
    // top left
    move = {
        from: pos,
        to: new BoardSquare(( pos.row + 1 as Coord ), ( pos.col - 1 as Coord ))
    };
    toReturn.push( move );

    // top right
    move = {
        from: pos,
        to: new BoardSquare(( pos.row + 1 as Coord ), ( pos.col + 1 as Coord ))
    };
    toReturn.push( move );

    // bottom left
    move = {
        from: pos,
        to: new BoardSquare(( pos.row - 1 as Coord ), ( pos.col - 1 as Coord ))
    };
    toReturn.push( move );

    // bottom right
    move = {
        from: pos,
        to: new BoardSquare(( pos.row - 1 as Coord ), ( pos.col + 1 as Coord ))
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