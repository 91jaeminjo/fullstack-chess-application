package com.talentpath.chess.controllers;


import com.talentpath.chess.dtos.GameView;
import com.talentpath.chess.dtos.MoveRequest;
import com.talentpath.chess.dtos.UndoRequest;
import com.talentpath.chess.services.ChessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChessWebSocketController {

    @Autowired
    ChessService chessService;

    @MessageMapping("/gameById")
    @SendTo("/topic/chess-front-end")
    public GameView greeting(Integer gameId) throws Exception {
        return chessService.getGameById(gameId);
    }

    @MessageMapping("/makeMove")
    @SendTo("/topic/chess-front-end")
    public GameView makeMoveWS(MoveRequest moveRequest) throws Exception {

        return chessService.makeMove(moveRequest);
    }
    @MessageMapping("/undoMove")
    @SendTo("/topic/chess-front-end")
    public GameView undoMoveWS(UndoRequest undoRequest) throws Exception {

        return chessService.undoMove(undoRequest);
    }

}
