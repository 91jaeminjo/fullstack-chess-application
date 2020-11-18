package com.talentpath.chess.dtos;

public class SelectedPiece {
    private Integer boardId;
    private String pieceColor;
    private String pieceType;
    private Integer position;

    public Integer getBoardId() {
        return boardId;
    }

    public void setBoardId(Integer boardId) {
        this.boardId = boardId;
    }

    public String getPieceColor() {
        return pieceColor;
    }

    public void setPieceColor(String pieceColor) {
        this.pieceColor = pieceColor;
    }

    public String getPieceType() {
        return pieceType;
    }

    public void setPieceType(String pieceType) {
        this.pieceType = pieceType;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }
}
