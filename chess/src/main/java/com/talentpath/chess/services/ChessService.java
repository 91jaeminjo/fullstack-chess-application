package com.talentpath.chess.services;

import com.github.bhlangonijr.chesslib.Board;
import com.github.bhlangonijr.chesslib.move.Move;
import com.github.bhlangonijr.chesslib.move.MoveGenerator;
import com.github.bhlangonijr.chesslib.move.MoveGeneratorException;
import com.github.bhlangonijr.chesslib.move.MoveList;
import com.talentpath.chess.daos.ChessDao;
import com.talentpath.chess.dtos.MoveRequest;
import com.talentpath.chess.dtos.UndoRequest;
import com.talentpath.chess.exceptions.ChessDaoException;
import com.talentpath.chess.exceptions.InvalidInputException;
import com.talentpath.chess.exceptions.NullInputException;
import com.talentpath.chess.models.BoardData;
import com.talentpath.chess.models.Game;
import com.talentpath.chess.models.MoveHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChessService {

    ChessDao dao;

    @Autowired
    public ChessService(ChessDao dao){
        this.dao = dao;
    }

    public Game getGameById(Integer gameId) throws InvalidInputException {
        return dao.getGameById(gameId);
    }

    public List<Integer> getAllGameIds() {
        return dao.getAllGameIds();
    }

    public Game beginChessGame() throws NullInputException, ChessDaoException {
        BoardData boardDataToAdd = new BoardData();
        BoardData boardDataAdded = dao.addBoardWithoutGameId(boardDataToAdd);
        Game gameToAdd = new Game(boardDataAdded.getBoardId());
        Game gameAdded = dao.addGame(gameToAdd);
        boardDataAdded.setGameId(gameAdded.getGameId());
        boolean successUpdatingBoard = dao.updateBoard(boardDataAdded);
        if(successUpdatingBoard) {
            return gameAdded;
        }
        else{
            throw new ChessDaoException("Rows affected by update board during beginChessGame was not 1.");
        }
    }

    public BoardData getBoardById(Integer boardId) throws InvalidInputException {
        return dao.getBoardById(boardId);
    }

    public BoardData makeMove(MoveRequest moveRequest) throws InvalidInputException, NullInputException, MoveGeneratorException, ChessDaoException {
        int currentGameId = moveRequest.getGameId();
        int currentBoardId = moveRequest.getBoardId();

        Game gameToUpdate = dao.getGameById(currentGameId);
        BoardData boardDataToUpdate = dao.getBoardById(currentBoardId);
        if(gameToUpdate.getGameOver()){
            return boardDataToUpdate;
        }
        String prevState = boardDataToUpdate.getState().trim();

        // verify move
        String currentState = moveRequest.getCurrentState();
        Board testBoard = new Board();
        testBoard.loadFromFen(currentState);

        if(!prevState.equals(currentState)){
            throw new InvalidInputException("The state of board received doesn't match with the state in record.");
        }
        Board board = new Board();
        board.loadFromFen(prevState);
        MoveList moves = MoveGenerator.generateLegalMoves(board);
        String newMove = moveRequest.getNewMove();

        Move moveMade = null;
        boolean legalMove = false;
        for (Move move : moves) {

            if(move.toString().equals(newMove)){
                moveMade = move;
                legalMove = true;
                break;
            }

        }
        if(legalMove == false){

            return boardDataToUpdate;
        }

        board.doMove(moveMade);
        String newState = board.getFen();
        if(board.isMated()){
            gameToUpdate.setGameOver(true);
        }
        String prevStateSplit[] = prevState.split(" ");
        int moveCountIndex = prevStateSplit.length;
        int adjustment = prevStateSplit[1].equals("w")? 1: 0;
        int newMoveCount = Integer.parseInt(prevStateSplit[moveCountIndex-1])*2 - adjustment;
        MoveHistory moveHistory = new MoveHistory(currentGameId, newMoveCount, moveMade.toString() );
        boolean successUpdatingMoveHistory = dao.addMove(moveHistory);
        if(successUpdatingMoveHistory==false){
            throw new ChessDaoException("Rows affected by update move history during make move was not 1.");
        }
        Integer prevBoardId = boardDataToUpdate.getBoardId();
        BoardData newBoardData = new BoardData(currentGameId,prevBoardId,null,newState);

        newBoardData = dao.addBoard(newBoardData);

        int newBoardId = newBoardData.getBoardId();
        boardDataToUpdate.setNextBoardId(newBoardId);
        boolean successUpdatingBoard = dao.updateBoard(boardDataToUpdate);
        if(successUpdatingBoard == false){
            throw new ChessDaoException("Rows affected by update board during make move was not 1.");
        }

        gameToUpdate.setBoardId(newBoardId);
        boolean successUpdatingGame = dao.updateGame(gameToUpdate);
        if(successUpdatingGame == false){
            throw new ChessDaoException("Rows affected by update game during make move was not 1.");
        }
        System.out.println("new Board Data");
        System.out.println(newBoardData);
        return newBoardData;

    }

    public BoardData undoMove(MoveRequest moveRequest) throws InvalidInputException, NullInputException, ChessDaoException {
        int currentGameId = moveRequest.getGameId();
        int currentBoardId = moveRequest.getBoardId();

        Game currentGame = dao.getGameById(currentGameId);
        BoardData currentBoard = dao.getBoardById(currentBoardId);

        if(currentGame.getGameOver()){
            return currentBoard;
        }

        int prevBoardId = currentBoard.getPrevBoardId();
        BoardData prevBoard = dao.getBoardById(prevBoardId);
        prevBoard.setNextBoardId(null);
        boolean successfulUpdatingPreviousBoard = dao.updateBoard(prevBoard);
        if(successfulUpdatingPreviousBoard == false){
            throw new ChessDaoException("Rows affected by update previous board during undo move was not 1.");
        }
        prevBoard = dao.getBoardById(prevBoardId);
        List<MoveHistory> allMoves = dao.getAllMovesByGameId(currentGameId);
        int mostRecentMove = allMoves.stream().mapToInt(move->move.getMoveCount()).max().orElse(0);
        currentGame.setBoardId(prevBoardId);
        boolean successfulUpdatingGame = dao.updateGame(currentGame);
        if(successfulUpdatingGame == false){
            throw new ChessDaoException("Rows affected by update game during undo move was not 1.");
        }
        UndoRequest undoRequest = new UndoRequest(currentGameId, mostRecentMove);
        boolean successfulRemovingPreviousMove = dao.removeMove(undoRequest);
        if(successfulRemovingPreviousMove == false){
            throw new ChessDaoException("Rows affected by remove previous move during undo move was not 1.");
        }
        boolean successfulRemovingCurrentBoard = dao.removeBoard(currentBoardId);
        if(successfulRemovingCurrentBoard == false){
            throw new ChessDaoException("Rows affected by remove current board during undo move was not 1.");
        }

        return prevBoard;
    }
}
