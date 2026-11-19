package com.movie.movie.repository;

import com.movie.movie.domain.Room;
import com.movie.movie.domain.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    Room findByName(String name);

    boolean existsByName(String name);

    List<Room> findByRoomType(RoomType roomType);
}