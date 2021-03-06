package com.talentpath.chess.dtos;

public class MoveRequest {
    private Integer gameId;
    private String newMove;
    private String currentState;

    public Integer getGameId() {
        return gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    public String getNewMove() {
        return newMove;
    }

    public void setNewMove(String newMove) {
        this.newMove = newMove;
    }

    public String getCurrentState() {
        return currentState;
    }

    public void setCurrentState(String currentState) {
        this.currentState = currentState;
    }
}
