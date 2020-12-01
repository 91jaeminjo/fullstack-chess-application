package com.talentpath.chess.models;

import java.io.Serializable;

public class ChessMoveId implements Serializable {
    public int gameData;
    public int moveCount;

    public ChessMoveId() {
    }

    public ChessMoveId(int game_data_game_id, int move_count) {
        this.gameData = game_data_game_id;
        this.moveCount = move_count;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ChessMoveId)) return false;

        ChessMoveId that = (ChessMoveId) o;

        if (gameData != that.gameData) return false;
        return moveCount == that.moveCount;
    }

    @Override
    public int hashCode() {
        int result = gameData;
        result = 31 * result + moveCount;
        return result;
    }
}
