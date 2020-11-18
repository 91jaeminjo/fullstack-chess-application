package com.talentpath.chess.models;

public class MoveHistory {
    private Integer gameId;
    private Integer moveCount;
    private String move;

    public MoveHistory() {
    }

    public MoveHistory(Integer gameId, Integer moveCount, String move) {
        this.gameId = gameId;
        this.moveCount = moveCount;
        this.move = move;
    }

    public MoveHistory(MoveHistory toCopy){
        this.gameId = toCopy.gameId;
        this.moveCount = toCopy.moveCount;
        this.move = toCopy.move;
    }

    public Integer getGameId() {
        return gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    public Integer getMoveCount() {
        return moveCount;
    }

    public void setMoveCount(Integer moveCount) {
        this.moveCount = moveCount;
    }

    public String getMove() {
        return move;
    }

    public void setMove(String move) {
        this.move = move;
    }
}
