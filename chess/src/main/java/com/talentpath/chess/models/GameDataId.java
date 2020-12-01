package com.talentpath.chess.models;


public class GameDataId {
    public Integer gameId;

    public GameDataId() {
    }

    public GameDataId(Integer gameId) {
        this.gameId = gameId;
    }

    public Integer getGameId() {
        return gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GameDataId)) return false;

        GameDataId that = (GameDataId) o;

        return getGameId() != null ? getGameId().equals(that.getGameId()) : that.getGameId() == null;
    }

    @Override
    public int hashCode() {
        return getGameId() != null ? getGameId().hashCode() : 0;
    }
}
