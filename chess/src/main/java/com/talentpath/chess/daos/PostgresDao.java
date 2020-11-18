package com.talentpath.chess.daos;

import com.github.bhlangonijr.chesslib.move.Move;
import com.talentpath.chess.dtos.UndoRequest;
import com.talentpath.chess.exceptions.InvalidInputException;
import com.talentpath.chess.exceptions.NullInputException;
import com.talentpath.chess.models.BoardData;
import com.talentpath.chess.models.Game;
import com.talentpath.chess.models.MoveHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Component
@Profile({"production", "daotest"})
public class PostgresDao implements ChessDao {

    @Autowired
    private JdbcTemplate template;

    @Override
    public Game addGame(Game toAdd) throws NullInputException {
        if(toAdd == null || toAdd.getBoardId() == null){
            throw new NullInputException("Null input provided in addGame method of PostgreDao.");
        }
        List<Integer> addedGameId = template.query("INSERT INTO \"Games\" (\"boardId\", \"gameOver\")\n" +
                "VALUES ("+toAdd.getBoardId()+","+toAdd.getGameOver()+")\n" +
                "RETURNING \"gameId\";",new GameIdMapper());
        toAdd.setGameId(addedGameId.get(0));
        return toAdd;
    }

    @Override
    public List<Integer> getAllGameIds() {
        List<Integer> allGameIds = template.query("SELECT \"gameId\" FROM \"Games\" " +
                "ORDER BY \"gameId\" ASC;", new GameIdMapper());
        return allGameIds;
    }

    @Override
    public List<Game> getAllGames() {
        return template.query("SELECT * FROM \"Games\";", new GameMapper());
    }

    @Override
    public Game getGameById(Integer gameId) throws InvalidInputException {

        try {
            Game retrievedGame = template.queryForObject("SELECT * FROM \"Games\" WHERE \"gameId\" = " + gameId + ";",
                    new GameMapper());
            return retrievedGame;
        } catch (DataAccessException ex){

            throw new InvalidInputException("Error retrieving game id: " + gameId, ex);
        }
    }

    @Override
    public boolean updateGame(Game toUpdate) throws NullInputException {
        if(toUpdate == null){
            throw new NullInputException("Null was passed into updateBoard.");
        }
        Integer rowsAffected = template.update("UPDATE \"Games\" " +
                "SET \"boardId\" = "+toUpdate.getBoardId()+ ", " +
                "\"gameOver\" = "+toUpdate.getGameOver()+ " " +
                "WHERE \"gameId\" = "+toUpdate.getGameId()+";");

        return rowsAffected == 1;
    }

    @Override
    public boolean removeGame(Integer gameId) {
        Integer rowsAffected = template.update("DELETE FROM \"Games\" " +
                "WHERE \"gameId\" = "+gameId+";");

        return rowsAffected == 1;
    }

    @Override
    public BoardData addBoard(BoardData toAdd) throws NullInputException {
        if(toAdd == null || toAdd.getState() == null || toAdd.getState().isBlank()){
            throw new NullInputException("Null input received in addBoard method in PostgresDao.");
        }
        List<Integer> addedBoardId = template.query("INSERT INTO \"Boards\" (\"gameId\", \"prevBoardId\", \"nextBoardId\", \"state\")\n" +
                "VALUES ("+toAdd.getGameId()+", "+toAdd.getPrevBoardId()+", "+toAdd.getNextBoardId()+", '"+toAdd.getState()+"') \n" +
                "RETURNING \"boardId\";", new BoardIdMapper());
        toAdd.setBoardId(addedBoardId.get(0));
        return toAdd;
    }

    @Override
    public BoardData addBoardWithoutGameId(BoardData toAdd) throws NullInputException {
        if(toAdd == null || toAdd.getState() == null || toAdd.getState().isBlank()){
            throw new NullInputException("Null input received in addBoard method in PostgresDao.");
        }
        List<Integer> addedBoardId = template.query("INSERT INTO \"Boards\" (\"prevBoardId\", \"nextBoardId\", \"state\")\n" +
                "VALUES ( "+toAdd.getPrevBoardId()+", "+toAdd.getNextBoardId()+", '"+toAdd.getState()+"') \n" +
                "RETURNING \"boardId\";", new BoardIdMapper());
        toAdd.setBoardId(addedBoardId.get(0));
        return toAdd;
    }

    @Override
    public List<BoardData> getAllBoards() {
        return template.query("SELECT * FROM \"Boards\";", new BoardMapper());
    }

    @Override
    public List<BoardData> getAllBoardsByGameId(Integer gameId) throws InvalidInputException {
        try {
            List<BoardData> retrievedBoardData = template.query("SELECT * FROM \"Boards\" WHERE \"gameId\" = " + gameId + ";",
                    new BoardMapper());
            return retrievedBoardData;
        } catch (DataAccessException ex){

            throw new InvalidInputException("Error retrieving boards by game id: " + gameId, ex);
        }
    }

    @Override
    public BoardData getBoardById(Integer boardId) throws InvalidInputException {
        try {
            BoardData retrievedBoardData = template.queryForObject("SELECT * FROM \"Boards\" WHERE \"boardId\" = " + boardId + ";",
                    new BoardMapper());
            return retrievedBoardData;
        } catch (DataAccessException ex){

            throw new InvalidInputException("Error retrieving board id: " + boardId, ex);
        }
    }

    @Override
    public boolean updateBoard(BoardData toUpdate) throws NullInputException {
        if(toUpdate == null){
            throw new NullInputException("Null was passed into updateBoard.");
        }
        Integer rowsAffected = template.update("UPDATE \"Boards\" SET \"gameId\" = "+toUpdate.getGameId()+ ", "+
                " \"prevBoardId\" = "+toUpdate.getPrevBoardId()+"," +
                " \"nextBoardId\" = "+toUpdate.getNextBoardId()+", " +
                " \"state\" = '"+toUpdate.getState()+"' " +
                "WHERE \"boardId\" = "+toUpdate.getBoardId()+";");

        return rowsAffected == 1;

    }

    @Override
    public boolean removeBoard(Integer boardId) {
        Integer rowsAffected = template.update("DELETE FROM \"Boards\" " +
                "WHERE \"boardId\" = "+boardId+";");

        return rowsAffected == 1;

    }

    @Override
    public boolean addMove(MoveHistory toAdd) {
        Integer rowsAffected = template.update("INSERT INTO \"MoveHistory\" (\"gameId\", \"moveCount\", \"move\")\n" +
                "VALUES ("+toAdd.getGameId()+","+toAdd.getMoveCount()+",'"+toAdd.getMove()+"');");

        return rowsAffected == 1;
    }

    @Override
    public List<MoveHistory> getAllMoves() {
        List<MoveHistory> moveHistory = template.query("SELECT * FROM \"MoveHistory\";",
                new MoveHistoryMapper());

        return moveHistory;
    }

    @Override
    public List<MoveHistory> getAllMovesByGameId(Integer gameId) {
        List<MoveHistory> moveHistory = template.query("SELECT * FROM \"MoveHistory\" " +
                "WHERE \"gameId\" = "+gameId+";", new MoveHistoryMapper());

        return moveHistory;
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
        Integer rowsAffected = template.update("DELETE FROM \"MoveHistory\" " +
                "WHERE \"gameId\"="+undoRequest.getGameId()+" AND \"moveCount\" = "+undoRequest.getMoveNumber()+";");

        return rowsAffected == 1;

    }

    @Override
    public void reset() {

        template.update("TRUNCATE \"Games\", \"Boards\", \"MoveHistory\"  RESTART IDENTITY");
        template.update("ALTER SEQUENCE \"Games_gameId_seq\" RESTART;");
        template.update("ALTER SEQUENCE \"Boards_boardId_seq\" RESTART;");


        // add initial state game.
        List<Integer> addedBoardId = template.query("INSERT INTO \"Boards\" (\"prevBoardId\", \"nextBoardId\", \"state\")\n" +
                "VALUES ( null, null, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') \n" +
                "RETURNING \"boardId\";", new BoardIdMapper());

        List<Integer> addedGameId = template.query("INSERT INTO \"Games\" (\"boardId\", \"gameOver\")\n" +
                "VALUES ("+addedBoardId.get(0)+", false)\n" +
                "RETURNING \"gameId\";",new GameIdMapper());
        template.update("UPDATE \"Boards\" " +
                "SET \"gameId\" = "+addedGameId+ " " +
                "WHERE \"boardId\" = "+addedBoardId+";");
    }

    class GameIdMapper implements RowMapper<Integer> {

        @Override
        public Integer mapRow(ResultSet resultSet, int i) throws SQLException {
            return resultSet.getInt("gameId");
        }
    }

    class BoardIdMapper implements RowMapper<Integer> {

        @Override
        public Integer mapRow(ResultSet resultSet, int i) throws SQLException {
            return resultSet.getInt("boardId");
        }
    }
    class GameMapper implements RowMapper<Game>{

        @Override
        public Game mapRow(ResultSet resultSet, int i) throws SQLException{
            Game toReturn = new Game();
            toReturn.setGameId(resultSet.getInt("gameId"));
            toReturn.setBoardId(resultSet.getInt("boardId"));
            toReturn.setGameOver(resultSet.getBoolean("gameOver"));
            return toReturn;
        }
    }

    class BoardMapper implements RowMapper<BoardData>{

        @Override
        public BoardData mapRow(ResultSet resultSet, int i) throws SQLException{
            BoardData toReturn = new BoardData();
            toReturn.setBoardId(resultSet.getInt("boardId"));
            toReturn.setGameId(resultSet.getInt("gameId"));
            toReturn.setPrevBoardId(resultSet.getInt("prevBoardId"));
            toReturn.setNextBoardId(resultSet.getInt("nextBoardId"));
            toReturn.setState(resultSet.getString("state"));

            return toReturn;
        }
    }
    class MoveHistoryMapper implements RowMapper<MoveHistory>{
        @Override
        public MoveHistory mapRow(ResultSet resultSet, int i) throws SQLException {
            MoveHistory toReturn = new MoveHistory();
            toReturn.setGameId(resultSet.getInt("gameId"));
            toReturn.setMoveCount(resultSet.getInt("moveCount"));
            toReturn.setMove(resultSet.getString("move"));

            return toReturn;
        }
    }
}
