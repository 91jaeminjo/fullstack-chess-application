package com.talentpath.chess.daos;

import com.talentpath.chess.dtos.UndoRequest;
import com.talentpath.chess.exceptions.InvalidInputException;
import com.talentpath.chess.exceptions.NullInputException;
import com.talentpath.chess.models.BoardData;
import com.talentpath.chess.models.Game;
import com.talentpath.chess.models.MoveHistory;

import java.util.List;

public interface ChessDao {


    Game addGame(Game toAdd) throws NullInputException;
    List<Integer> getAllGameIds();
    List<Game> getAllGames();
    Game getGameById(Integer gameId) throws InvalidInputException;
    boolean updateGame(Game toUpdate) throws NullInputException;
    boolean removeGame(Integer gameId);

    BoardData addBoard(BoardData toAdd) throws NullInputException;
    BoardData addBoardWithoutGameId(BoardData toAdd) throws NullInputException;
    List<BoardData> getAllBoards();
    List<BoardData> getAllBoardsByGameId(Integer gameId) throws InvalidInputException;
    BoardData getBoardById(Integer boardId) throws InvalidInputException;
    boolean updateBoard(BoardData toUpdate) throws NullInputException;
    boolean removeBoard(Integer boardId);

    boolean addMove(MoveHistory toAdd);
    List<MoveHistory> getAllMoves();
    List<MoveHistory> getAllMovesByGameId(Integer gameId);
    MoveHistory getMoveById(Integer moveId);
    boolean updateMove(MoveHistory toUpdate);
    boolean removeMove(UndoRequest undoRequest);


    void reset();
}
