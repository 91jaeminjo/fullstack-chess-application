package com.talentpath.chess.dtos;

public class PromotionRequest {
    private Integer gameId;
    private String newMove;
    private Integer promoteTo;
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

    public Integer getPromoteTo() {
        return promoteTo;
    }

    public void setPromoteTo(Integer promoteTo) {
        this.promoteTo = promoteTo;
    }

    public String getCurrentState() {
        return currentState;
    }

    public void setCurrentState(String currentState) {
        this.currentState = currentState;
    }
}
