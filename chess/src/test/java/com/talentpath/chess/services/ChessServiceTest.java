package com.talentpath.chess.services;

import com.talentpath.chess.daos.ChessDao;
import com.talentpath.chess.exceptions.ChessDaoException;
import com.talentpath.chess.exceptions.InvalidInputException;
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

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@ActiveProfiles( "daotest" )
class ChessServiceTest {

    ChessService service;

    @Autowired
    ChessDao daoToTest;

    String initialState = "wr,wn,ws,wq,wk,ws,wn,wr," +
            "wp,wp,wp,wp,wp,wp,wp,wp," +
            "00,00,00,00,00,00,00,00," +
            "00,00,00,00,00,00,00,00," +
            "00,00,00,00,00,00,00,00," +
            "00,00,00,00,00,00,00,00," +
            "bp,bp,bp,bp,bp,bp,bp,bp," +
            "br,bn,bs,bq,bk,bs,bn,br";

    @BeforeEach
    void setUp() {
        service = new ChessService(daoToTest);
        daoToTest.reset();
    }

    @Test
    void beginChessGame() {
        // arrange
        try {
            // get num of games and boards before beginning a new game.
            List<Game> allGames = daoToTest.getAllGames();
            List<BoardData> allBoardData = daoToTest.getAllBoards();
            Integer numOfGames = allGames!= null? allGames.size(): 0;
            Integer numOfBoards = allBoardData !=null? allBoardData.size(): 0;

            // action
            Game started = service.beginChessGame();
            // assert

            // check num of games and boards should have increased by 1
            assertEquals(numOfBoards + 1, daoToTest.getAllBoards().size());
            assertEquals(numOfGames + 1, daoToTest.getAllGames().size());

            // retrieve game and board by the returned game object
            Game addedGame = daoToTest.getGameById(started.getGameId());
            BoardData addedBoardData = daoToTest.getBoardById(started.getBoardId());

            // game and board id of the returned game object should really exist
            assertNotNull(addedGame.getGameId());
            assertNotNull(addedBoardData.getBoardId());
            assertNotNull(addedBoardData.getGameId());
            assertEquals(addedGame.getGameId(), started.getGameId());
            assertEquals(addedBoardData.getBoardId(), started.getBoardId());

            // check instance variables in board: moves should be 0,
            // prev and next boards should be null

            assertEquals(0, addedBoardData.getPrevBoardId());
            assertEquals(0, addedBoardData.getNextBoardId());
            assertEquals(initialState, addedBoardData.getState());
        }
        catch(NullInputException | InvalidInputException | ChessDaoException ex){
            fail("Exception caught during begin game golden path test: " + ex.getMessage());
        }
    }

    @Test
    void getGameById() {

        try {
            // arrange
            // act
            Game retrievedGameOne = daoToTest.getGameById(1);
            Game retrievedGameTwo = daoToTest.getGameById(2);
            // assert
            assertEquals(1, retrievedGameOne.getGameId());
            assertEquals(1, retrievedGameOne.getBoardId());
            assertEquals(2, retrievedGameTwo.getGameId());
            assertEquals(2, retrievedGameTwo.getBoardId());

        } catch(InvalidInputException ex){
            fail("Exception caught during getGameById golden path test: "+ex.getMessage());
        }
    }

    @Test
    void getGameByInvalidId() {

        try {
            // arrange
            // act
            Game retrieved = daoToTest.getGameById(15);
            // assert
            fail("Exception not thrown when provided invalid id to getGameById.");

        } catch(InvalidInputException ex){

        }
    }

    @Test
    void getBoardById() {
        try {
            // arrange
            // act
            BoardData retrievedBoardDataOne = daoToTest.getBoardById(1);
            BoardData retrievedBoardDataTwo = daoToTest.getBoardById(2);

            // assert
            assertEquals(1, retrievedBoardDataOne.getGameId());
            assertEquals(1, retrievedBoardDataOne.getBoardId());

            assertEquals(initialState, retrievedBoardDataOne.getState());
            assertNull(retrievedBoardDataOne.getPrevBoardId());
            assertNull(retrievedBoardDataOne.getPrevBoardId());


            assertEquals(2, retrievedBoardDataTwo.getGameId());
            assertEquals(2, retrievedBoardDataTwo.getBoardId());

            assertEquals(initialState, retrievedBoardDataTwo.getState());
            assertNull(retrievedBoardDataTwo.getPrevBoardId());
            assertNull(retrievedBoardDataTwo.getNextBoardId());


        } catch(InvalidInputException ex){
            fail("Exception caught during getBoardById golden path: "+ex.getMessage());
        }
    }

    @Test
    void getBoardByInvalidId() {
        try {
            // arrange
            // act
            BoardData retrieved = daoToTest.getBoardById(20);
            // assert
            fail("Exception not thrown when invalid id provided to getBoardById.");
        } catch(InvalidInputException ex){

        }
    }


    @Test
    void makeMove() {
    }
}