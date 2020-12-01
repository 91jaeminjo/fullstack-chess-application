package com.talentpath.chess.models;

import javax.persistence.*;

@Entity
@Table(name ="ChessMove")
@IdClass(ChessMoveId.class)
public class ChessMove {

    @Id
    @ManyToOne
    @JoinColumn(name = "game_data_game_id")
    private GameData gameData;
    @Id
    private Integer moveCount;
    private String move;

    public ChessMove() {
        moveCount = 0;
    }

    public ChessMove(GameData gameData, int moveCount, String move) {
        this.gameData = gameData;
        this.moveCount = moveCount;
        this.move = move;
    }

    public GameData getGameData() {
        return gameData;
    }

    public void setGameData(GameData gameData) {
        this.gameData = gameData;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ChessMove)) return false;

        ChessMove that = (ChessMove) o;

        if (getGameData() != null ? !getGameData().equals(that.getGameData()) : that.getGameData() != null)
            return false;
        if (getMoveCount() != null ? !getMoveCount().equals(that.getMoveCount()) : that.getMoveCount() != null)
            return false;
        return getMove() != null ? getMove().equals(that.getMove()) : that.getMove() == null;
    }

    @Override
    public int hashCode() {
        int result = getGameData() != null ? getGameData().hashCode() : 0;
        result = 31 * result + (getMoveCount() != null ? getMoveCount().hashCode() : 0);
        result = 31 * result + (getMove() != null ? getMove().hashCode() : 0);
        return result;
    }
}
