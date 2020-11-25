package com.talentpath.chess.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table( name="GameData")
public class GameData {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Integer gameId;
    private Boolean gameOver;

    public GameData() {
    }

    public Integer getGameId() {
        return gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    public Boolean getGameOver() {
        return gameOver;
    }

    public void setGameOver(Boolean gameOver) {
        this.gameOver = gameOver;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GameData)) return false;

        GameData gameData = (GameData) o;

        if (getGameId() != null ? !getGameId().equals(gameData.getGameId()) : gameData.getGameId() != null)
            return false;
        return getGameOver() != null ? getGameOver().equals(gameData.getGameOver()) : gameData.getGameOver() == null;
    }

    @Override
    public int hashCode() {
        int result = getGameId() != null ? getGameId().hashCode() : 0;
        result = 31 * result + (getGameOver() != null ? getGameOver().hashCode() : 0);
        return result;
    }
}
