package com.talentpath.chess.daos;

import com.talentpath.chess.models.GameData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameDataRepository extends JpaRepository<GameData, Integer> {

    @Query( value = "SELECT \"game_id\" FROM \"game_data\" ORDER BY \"game_id\" ASC;",
            nativeQuery = true)
    List<Integer> findAllGameIds();

    GameData findByGameId(int currentGameId);
}
