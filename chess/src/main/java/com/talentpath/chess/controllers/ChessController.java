package com.talentpath.chess.controllers;

import com.github.bhlangonijr.chesslib.move.MoveGeneratorException;
import com.talentpath.chess.dtos.GameView;
import com.talentpath.chess.dtos.MoveRequest;
import com.talentpath.chess.dtos.UndoRequest;
import com.talentpath.chess.exceptions.ChessDaoException;
import com.talentpath.chess.exceptions.InvalidInputException;
import com.talentpath.chess.exceptions.NullInputException;
import com.talentpath.chess.models.GameData;
import com.talentpath.chess.services.ChessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class ChessController {

    @Autowired
    ChessService chessService;

    @PostMapping("/begin")
    public GameView beginChessGame() throws NullInputException, ChessDaoException {
        return chessService.beginChessGame();
    }

    @GetMapping("game/{gameId}")
    public GameView getGameById(@PathVariable Integer gameId) throws InvalidInputException {
        return chessService.getGameById(gameId);
    }

    @GetMapping("game/ids")
    public List<Integer> getAllGameIds(){
        return chessService.getAllGameIds();
    }

    @PostMapping("/makeMove")
    public GameView makeMove(@RequestBody MoveRequest moveRequest) throws InvalidInputException, NullInputException, MoveGeneratorException, ChessDaoException {
        return chessService.makeMove(moveRequest);
    }

    @PostMapping("/undoMove")
    public GameView undoMove(@RequestBody UndoRequest moveRequest) throws InvalidInputException, NullInputException, ChessDaoException {
        return chessService.undoMove(moveRequest);
    }

    @GetMapping("/promote")
    public GameView promotePiece(){
        return chessService.promotePawn();
    }

}
