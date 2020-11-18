package com.talentpath.chess.models;

public class BoardData {

    private Integer boardId;
    private Integer gameId;
    private Integer prevBoardId;
    private Integer nextBoardId;
    // FEN notation
    private String state;

    public BoardData() {
        boardId = null;
        gameId = null;
        prevBoardId = null;
        nextBoardId = null;
        // Starting FEN position.
        state = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }

    public BoardData(Integer gameId, Integer prevBoardId, Integer nextBoardId, String state) {

        this.gameId = gameId;
        this.prevBoardId = prevBoardId;
        this.nextBoardId = nextBoardId;
        this.state = state;
    }

    public BoardData(Integer boardId, Integer gameId, Integer prevBoardId, Integer nextBoardId, String state ) {
        this.boardId = boardId;
        this.gameId = gameId;
        this.prevBoardId = prevBoardId;
        this.nextBoardId = nextBoardId;
        this.state = state;
    }

    public BoardData(BoardData toCopy ){
        this.boardId = toCopy.boardId;
        this.gameId = toCopy.gameId;
        this.prevBoardId = toCopy.prevBoardId;
        this.nextBoardId = toCopy.nextBoardId;
        this.state = toCopy.state;
    }

    public Integer getBoardId() {
        return boardId;
    }

    public void setBoardId(Integer boardId) {
        this.boardId = boardId;
    }

    public Integer getGameId() {
        return gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    public Integer getPrevBoardId() {
        return prevBoardId;
    }

    public void setPrevBoardId(Integer prevBoardId) {
        this.prevBoardId = prevBoardId;
    }

    public Integer getNextBoardId() {
        return nextBoardId;
    }

    public void setNextBoardId(Integer nextBoardId) {
        this.nextBoardId = nextBoardId;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
