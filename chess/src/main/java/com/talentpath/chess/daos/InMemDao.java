package com.talentpath.chess.daos;

import com.talentpath.chess.dtos.UndoRequest;
import com.talentpath.chess.exceptions.NullInputException;
import com.talentpath.chess.models.BoardData;
import com.talentpath.chess.models.Game;
import com.talentpath.chess.models.MoveHistory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Profile("servicetest")
public class InMemDao implements ChessDao{

    List<Game> allGames = new ArrayList<>();
    List<BoardData> allBoardData = new ArrayList<>();

    @Override
    public Game addGame(Game toAdd) {
        Game copy = new Game(toAdd);
        copy.setGameId( allGames.stream().mapToInt( game -> game.getGameId()).max().orElse(0) + 1);
        allGames.add(copy);
        return new Game(copy);
    }

    @Override
    public List<Integer> getAllGameIds() {
        throw new UnsupportedOperationException();
    }

    @Override
    public List<Game> getAllGames() {
        return allGames.stream().map( game -> new Game(game)).collect(Collectors.toList());
    }

    @Override
    public Game getGameById(Integer gameId) {
        Game toReturn = allGames.stream().filter(game -> game.getGameId().equals(gameId)).findAny().orElse(null);
        if(toReturn != null) {
            return toReturn;
        }
        else{
            throw new UnsupportedOperationException();
        }
    }

    @Override
    public boolean updateGame(Game toUpdate) {
        return false;
    }

    @Override
    public boolean removeGame(Integer gameId) {
        return false;
    }

    @Override
    public BoardData addBoard(BoardData toAdd) throws NullInputException {
        return null;
    }

    @Override
    public BoardData addBoardWithoutGameId(BoardData toAdd) {
        BoardData copy = new BoardData(toAdd);
        copy.setBoardId( allBoardData.stream().mapToInt(board -> board.getBoardId() ).max().orElse(0) + 1 );
        allBoardData.add(copy);
        return new BoardData(copy);
    }

    @Override
    public List<BoardData> getAllBoards() {
        return allBoardData.stream().map(board -> new BoardData(board)).collect(Collectors.toList());
    }

    @Override
    public List<BoardData> getAllBoardsByGameId(Integer gameId) {
        return null;
    }

    @Override
    public BoardData getBoardById(Integer boardId) {
        BoardData toReturn = allBoardData.stream().filter(board -> board.getBoardId().equals(boardId) ).findAny().orElse(null);
        if(toReturn != null){
            return toReturn;
        }
        else{
            throw new UnsupportedOperationException();
        }
    }

    @Override
    public boolean updateBoard(BoardData toUpdate) {
        throw new UnsupportedOperationException();
        //boolean success = allBoards.stream().filter( board -> (board.getBoardId() == toUpdate.getBoardId())).findAny().orElse(null) != null;
        //allBoards = allBoards.stream().map( board -> ( board.getBoardId().equals(toUpdate.getBoardId() )) ? toUpdate : board ).collect(Collectors.toList());
        //return success;
    }

    @Override
    public boolean removeBoard(Integer boardId) {
        return false;
    }

    @Override
    public boolean addMove(MoveHistory toAdd) {
        return false;
    }

    @Override
    public List<MoveHistory> getAllMoves() {
        return null;
    }

    @Override
    public List<MoveHistory> getAllMovesByGameId(Integer gameId) {
        return null;
    }

    @Override
    public MoveHistory getMoveById(Integer moveId) {
        return null;
    }

    @Override
    public boolean updateMove(MoveHistory toUpdate) {
        return false;
    }

    @Override
    public boolean removeMove(UndoRequest undoRequest) {
        return false;
    }

    @Override
    public void reset() {
        allGames.clear();
        allBoardData.clear();
    }
}
