package com.talentpath.chess.services;

import com.github.bhlangonijr.chesslib.Board;
import com.github.bhlangonijr.chesslib.Side;
import com.github.bhlangonijr.chesslib.move.Move;
import com.github.bhlangonijr.chesslib.move.MoveGenerator;
import com.github.bhlangonijr.chesslib.move.MoveGeneratorException;
import com.github.bhlangonijr.chesslib.move.MoveList;
import com.talentpath.chess.daos.*;
import com.talentpath.chess.dtos.GameView;
import com.talentpath.chess.dtos.MoveRequest;
import com.talentpath.chess.dtos.UndoRequest;
import com.talentpath.chess.exceptions.InvalidInputException;
import com.talentpath.chess.exceptions.NullInputException;
import com.talentpath.chess.models.GameData;
import com.talentpath.chess.models.ChessMove;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.Comparator;
import java.util.List;

@Service
public class ChessService {

    @Autowired
    GameDataRepository gameDataRepository;

    @Autowired
    ChessMoveRepository chessMoveRepository;

    public GameView beginChessGame() {
        GameData gameDataToAdd = new GameData();
        gameDataToAdd.setGameOver(false);
        gameDataToAdd = gameDataRepository.saveAndFlush(gameDataToAdd);
        GameView gameView = new GameView(gameDataToAdd);
        gameView.setState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        return gameView;
    }

    private Board replayMoves(Integer currentGameId){

        List<ChessMove> newAllMoves = chessMoveRepository.findByGameDataGameIdOrderByMoveCountAsc(currentGameId);

        Board board = new Board();
        if(newAllMoves.size()==0){
            return board;
        }
        Side side = Side.WHITE;

        for(ChessMove chessMove : newAllMoves){
            Move move = new Move(chessMove.getMove(),side);
            board.doMove(move);
            side = (side == Side.WHITE)? Side.BLACK: Side.WHITE;
        }
        return board;
    }

    public List<Integer> getAllGameIds() {
        return gameDataRepository.findAllGameIds();
    }

    public GameView getGameById(Integer gameId) throws NullInputException, InvalidInputException {
        if(gameId == null){
            throw new NullInputException("Null gameId received in ChessService.getGameById.");
        }

        List<Integer> allGameIds = getAllGameIds();
        if(!allGameIds.contains(gameId)){
            throw new InvalidInputException("gameId received in ChessService.getGameById is not present in all game ids.");
        }

        GameData currentGameData = gameDataRepository.findById(gameId).orElse(null);
        GameView gameView = new GameView();
        if(currentGameData!=null){
            gameView = new GameView(currentGameData);
            Board board = replayMoves(gameId);
            String stateInRecord = board.getFen().trim();
            gameView.setState(stateInRecord);
        }

        return gameView;
    }

    public GameView makeMove(MoveRequest moveRequest) throws InvalidInputException, NullInputException, MoveGeneratorException {
        if(moveRequest==null){
            throw new NullInputException("Null move request received in ChessService.makeMove.");
        }
        int currentGameId = moveRequest.getGameId();
        List<Integer> allGameIds = getAllGameIds();
        if(!allGameIds.contains(currentGameId)){
            throw new InvalidInputException("gameId in moveRequest received in ChessService.makeMove is not present in all game ids.");
        }
        GameData currentGameData = gameDataRepository.findByGameId(currentGameId);
        GameView gameView = new GameView(currentGameData);

        Board board = replayMoves(currentGameId);
        String stateInRecord = board.getFen().trim();
        if(currentGameData.getGameOver()){
            gameView.setState(stateInRecord);
            return gameView;
        }
        // verify move
        String stateFromInput = moveRequest.getCurrentState().trim();

        if(!stateInRecord.equals(stateFromInput)){
            throw new InvalidInputException("The FEN state of input doesn't match the FEN state of record.\n" +
                    "FEN record: "+stateInRecord+".\n" +
                    "FEN input: "+stateFromInput+".");
        }
        MoveList moves = MoveGenerator.generateLegalMoves(board);
        String requestedMove = moveRequest.getNewMove();

        Move newMove = null;
        boolean legalMove = false;
        for (Move move : moves) {
            if(move.toString().equals(requestedMove)){
                newMove = move;
                legalMove = true;
                break;
            }
        }
        if(legalMove == false){
            gameView.setState(stateInRecord);
            return gameView;
        }
        gameView.setLastMove(requestedMove);
        board.doMove(newMove);
        String newState = board.getFen();
        gameView.setState(newState);
        if(board.isMated()){
            currentGameData.setGameOver(true);
            gameDataRepository.save(currentGameData);
            gameView.setGameOver(true);
        }
        int moveCount = board.getMoveCounter();

        String prevStateSplit[] = stateInRecord.split(" ");
        int moveCountIndex = prevStateSplit.length;
        int adjustment = prevStateSplit[1].equals("w")? 1: 0;
        int newMoveCount = Integer.parseInt(prevStateSplit[moveCountIndex-1])*2 - adjustment;
        ChessMove chessMove = new ChessMove(currentGameData, newMoveCount, requestedMove );
        chessMove =  chessMoveRepository.saveAndFlush(chessMove);

        return gameView;
    }

    public GameView undoMove(UndoRequest undoRequest) throws InvalidInputException, NullInputException {
        if(undoRequest==null){
            throw new NullInputException("Null undo request received in ChessService.undoMove.");
        }
        int currentGameId = undoRequest.getGameId();
        List<Integer> allGameIds = getAllGameIds();
        if(!allGameIds.contains(currentGameId)){
            throw new InvalidInputException("gameId in undoRequest received in ChessService.undoMove is not present in all game ids.");
        }
        GameData currentGameData = gameDataRepository.findByGameId(currentGameId);
        GameView gameView = new GameView(currentGameData);

        Board board = replayMoves(currentGameId);
        String stateInRecord = board.getFen();
        gameView.setState(stateInRecord);
        if(currentGameData.getGameOver()){
            return gameView;
        }
        String stateFromInput = undoRequest.getCurrentState().trim();
        if(!stateInRecord.equals(stateFromInput)){
            throw new InvalidInputException("The FEN state of input doesn't match the FEN state of record.\n" +
                    "FEN record: "+stateInRecord+".\n" +
                    "FEN input: "+stateFromInput+".");
        }

        List<ChessMove> allMoves = chessMoveRepository.findByGameDataGameIdOrderByMoveCountAsc(currentGameId);
        if(allMoves.size()>0) {
            ChessMove mostRecentMove = allMoves.stream().max(Comparator.comparingInt(ChessMove::getMoveCount)).orElse(null);

            chessMoveRepository.delete(mostRecentMove);
            board.undoMove();
            gameView.setState(board.getFen());
        }

        return gameView;
    }
}
