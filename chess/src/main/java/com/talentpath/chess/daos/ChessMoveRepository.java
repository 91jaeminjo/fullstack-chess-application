package com.talentpath.chess.daos;

import com.talentpath.chess.models.ChessMove;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChessMoveRepository extends JpaRepository<ChessMove, Integer> {
    @Query(
            value = "SELECT * FROM \"chess_move\" WHERE \"game_data_game_id\" = (%:game_data_game_id%);",
            nativeQuery = true
    )
    List<ChessMove> getAllMovesByGameId(@Param("game_data_game_id") Integer game_data_game_id);



    List<ChessMove> findByGameDataGameIdOrderByMoveCountAsc(Integer currentGameId);
}
