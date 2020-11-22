package com.talentpath.chess.controllers;

import com.github.bhlangonijr.chesslib.move.MoveGeneratorException;
import com.talentpath.chess.dtos.MoveRequest;
import com.talentpath.chess.dtos.SelectedPiece;
import com.talentpath.chess.exceptions.ChessDaoException;
import com.talentpath.chess.exceptions.InvalidInputException;
import com.talentpath.chess.exceptions.NullInputException;
import com.talentpath.chess.models.BoardData;
import com.talentpath.chess.models.Game;
import com.talentpath.chess.services.ChessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class ChessController {

    @Autowired
    ChessService service;

    @PostMapping("/begin")
    public Game beginChessGame() throws NullInputException, ChessDaoException {
        return service.beginChessGame();
    }

    @GetMapping("/game/{gameId}")
    public Game getGameById(@PathVariable Integer gameId) throws InvalidInputException {
        return service.getGameById(gameId);
    }

    @GetMapping("/gameIds")
    public List<Integer> getAllGameIds(){
        return service.getAllGameIds();
    }

    @GetMapping("/board/{boardId}")
    public BoardData getBoardById(@PathVariable Integer boardId) throws InvalidInputException {
        return service.getBoardById(boardId);
    }

    @PostMapping("/makeMove")
    public BoardData makeMove(@RequestBody MoveRequest moveRequest) throws InvalidInputException, NullInputException, MoveGeneratorException, ChessDaoException {
        return service.makeMove(moveRequest);
    }

    @PostMapping("/undoMove")
    public BoardData undoMove(@RequestBody MoveRequest moveRequest) throws InvalidInputException, NullInputException, ChessDaoException {
        return service.undoMove(moveRequest);
    }

}
