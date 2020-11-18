package com.talentpath.chess.dtos;

public class UndoRequest {
    private Integer gameId;
    private Integer moveNumber;

    public Integer getGameId() {
        return gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    public Integer getMoveNumber() {
        return moveNumber;
    }

    public void setMoveNumber(Integer moveNumber) {
        this.moveNumber = moveNumber;
    }

    public UndoRequest(Integer gameId, Integer moveNumber) {
        this.gameId = gameId;
        this.moveNumber = moveNumber;
    }
}
