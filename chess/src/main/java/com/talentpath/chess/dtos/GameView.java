package com.talentpath.chess.dtos;

import com.talentpath.chess.models.GameData;

public class GameView {
    private Integer gameId;
    private String state;
    private Boolean gameOver;
    private String lastMove;

    public GameView() {

    }
    public GameView(GameData gameData){
        this.gameId = gameData.getGameId();
        this.gameOver = gameData.getGameOver();
        this.lastMove = "";
    }

    public Integer getGameId() {
        return gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Boolean getGameOver() {
        return gameOver;
    }

    public void setGameOver(Boolean gameOver) {
        this.gameOver = gameOver;
    }

    public String getLastMove() {
        return lastMove;
    }

    public void setLastMove(String lastMove) {
        this.lastMove = lastMove;
    }
}
