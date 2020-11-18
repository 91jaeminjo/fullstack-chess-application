package com.talentpath.chess.daos;

import com.talentpath.chess.exceptions.NullInputException;
import com.talentpath.chess.models.BoardData;
import com.talentpath.chess.models.Game;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@ActiveProfiles("daotest")
class PostgresDaoTest {

    @Autowired
    PostgresDao daoToTest;

    @BeforeEach
    void setUp() {
        daoToTest.reset();
    }

    String initialState = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    @Test
    void addGame() {
        try {
            // arrange
            // adding board to database to get the id to put into game.
            BoardData boardDataToAdd = new BoardData();
            BoardData boardDataAdded = daoToTest.addBoardWithoutGameId(boardDataToAdd);
            Integer boardId = boardDataAdded.getBoardId();

            // action
            Game gameToAdd = new Game(boardId);
            Game gameAdded = daoToTest.addGame(gameToAdd);

            //assertEquals(1, gameAdded.getGameId()); -- not testing game id.
            assertEquals(boardId, gameAdded.getBoardId());


        } catch (NullInputException ex) {
            fail("Exception caught during addGame golden path test: "+ex.getMessage());
        }

    }

    @Test
    void addGameNullInputGameObject() {
        try {
            // arrange
            // action
            Game gameAdded = daoToTest.addGame(null);

            // assert
            fail("Null exception not thrown when the input game object was null.");
        } catch (NullInputException ex) {

        }
    }
    @Test
    void addGameNullInputBoardId() {
        try {
            // arrange

            // action
            Game gameToAdd = new Game();
            Game gameAdded = daoToTest.addGame(gameToAdd);
            fail("Null exception not thrown when boardId of input game object was null.");

        } catch (NullInputException ex) {

        }

    }

    @Test
    void getAllGames() {
    }

    @Test
    void getGameById() {
    }

    @Test
    void updateGame() {
    }

    @Test
    void removeGame() {
    }

    @Test
    void addBoard() {

        try {
            // arrange
            BoardData toAdd = new BoardData();
            // action
            BoardData added = daoToTest.addBoardWithoutGameId(toAdd);
            // assert
            //assertEquals(1, added.getBoardId());
            assertNull(added.getPrevBoardId());
            assertNull(added.getNextBoardId());

            assertEquals(initialState, added.getState());


        } catch (NullInputException ex) {
            fail("Exception caught during addBoard golden path test: "+ex.getMessage());
        }
    }

    @Test
    void addBoardWithoutGameId(){
        try {
            // arrange
            BoardData boardDataToAdd = new BoardData();

            // act
            BoardData boardDataAdded = daoToTest.addBoardWithoutGameId(boardDataToAdd);

            // assert
            assertNull(boardDataAdded.getPrevBoardId());
            assertNull(boardDataAdded.getNextBoardId());
            assertEquals(initialState, boardDataAdded.getState());
        }
        catch(NullInputException ex){
            fail("Exception caught during a golden path addBoardWithoutGameId exception: "+ex.getMessage());
        }
    }

    @Test
    void addBoardWithoutGameIdNullInput(){
        try {
            // arrange


            // act
            BoardData boardDataAdded = daoToTest.addBoardWithoutGameId(null);

            // assert
            fail("Exception not thrown when null provided to the function.");
        }
        catch(NullInputException ex){

        }
    }

    @Test
    void getAllBoards() {
    }

    @Test
    void getAllBoardsByGameId() {
    }

    @Test
    void getBoardById() {
    }

    @Test
    void updateBoard() {
    }

    @Test
    void removeBoard() {
    }

    @Test
    void addMove() {
    }

    @Test
    void getAllMoves() {
    }

    @Test
    void getAllMovesByGameId() {
    }

    @Test
    void getMoveById() {
    }

    @Test
    void updateMove() {
    }

    @Test
    void removeMove() {
    }

    @Test
    void reset() {
    }
}