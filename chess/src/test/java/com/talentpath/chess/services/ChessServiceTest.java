package com.talentpath.chess.services;


import com.talentpath.chess.daos.GameDataRepository;
import com.talentpath.chess.dtos.GameView;
import com.talentpath.chess.dtos.MoveRequest;
import com.talentpath.chess.exceptions.InvalidInputException;
import com.talentpath.chess.exceptions.NullInputException;

import com.talentpath.chess.models.GameData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.management.Query;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles( "daotest" )
class ChessServiceTest {

    @Autowired
    ChessService service;

    @Autowired
    private JdbcTemplate template;


    @Autowired
    GameDataRepository gameDataRepository;

    @PersistenceContext
    EntityManager entityManager;
    String initialState = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    @BeforeEach
    void setUp() {
        gameDataRepository.deleteAll();
        template.execute("ALTER SEQUENCE \"game_data_game_id_seq\" RESTART WITH 1;");
    }

    @Test
    void beginChessGame() {
        // arrange
        // get num of games and boards before beginning a new game.
        List<Integer> allGameData = service.getAllGameIds();
        Integer numOfGames = allGameData != null? allGameData.size(): 0;


        // action
        GameView started = service.beginChessGame();
        // assert

        // check num of games and boards should have increased by 1
        assertEquals(numOfGames + 1, service.getAllGameIds().size());

        assertEquals(initialState, started.getState());
        assertFalse(started.getGameOver());
        assertEquals("",started.getLastMove());

    }

    @Test
    void getGameById() {

        try {
            // arrange
            service.beginChessGame();
            // act
            GameView retrievedGameDataOne = service.getGameById(1);

            // assert
            assertEquals(1, retrievedGameDataOne.getGameId());


        } catch(InvalidInputException | NullInputException ex){
            fail("Exception caught during getGameById golden path test: "+ex.getMessage());
        }
    }

    @Test
    void getGameByNullId(){
        try {
            // arrange
            // act
            GameView retrieved = service.getGameById(null);
            // assert
            fail("Exception not thrown when provided invalid id to getGameById.");

        } catch(NullInputException ex) {

        } catch (Exception ex) {
            fail("NullInput exception expected. Different exception caught: "+ex.getMessage());
        }
    }


    @Test
    void getGameByInvalidId() {

        try {
            // arrange
            // act
            GameView retrieved = service.getGameById(15);
            // assert
            fail("Exception not thrown when provided invalid id to getGameById.");

        } catch(InvalidInputException ex){

        } catch (Exception ex){
            fail("InvalidInput exception expected. Different exception caught: "+ex.getMessage());
        }
    }

    @Test
    void makeMove() {

        try {
            // arrange
            GameView gameView = service.beginChessGame();
            MoveRequest moveRequest = new MoveRequest();
            moveRequest.setGameId(gameView.getGameId());
            moveRequest.setCurrentState(gameView.getState());
            moveRequest.setNewMove("e2e4");
            // act
            GameView afterMove = service.makeMove(moveRequest);
            // assert
            assertEquals("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",afterMove.getState());


        } catch (Exception ex){
            fail("Exception caught during make move golden path test. "+ex.getMessage());
        }
    }
}