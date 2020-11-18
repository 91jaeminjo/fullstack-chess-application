package com.talentpath.chess.models;

public class Game {
    private Integer gameId;
    private Integer boardId;
    private Boolean gameOver;

    public Game() {
        this.gameOver = false;
    }

    public Game(Integer boardId){
        this.boardId = boardId;
        this.gameOver = false;
    }

    public Game(Integer gameId, Integer boardId, Boolean gameOver) {
        this.gameId = gameId;
        this.boardId = boardId;
        this.gameOver = gameOver;
    }

    public Game(Game toCopy){
        this.gameId = toCopy.gameId;
        this.boardId = toCopy.boardId;
        this.gameOver = toCopy.gameOver;
    }

    public Integer getGameId() {
        return gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    public Integer getBoardId() {
        return boardId;
    }

    public void setBoardId(Integer boardId) {
        this.boardId = boardId;
    }

    public Boolean getGameOver() {
        return gameOver;
    }

    public void setGameOver(Boolean gameOver) {
        this.gameOver = gameOver;
    }
}
