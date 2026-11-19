package com.movie.movie.controller;

import com.movie.movie.domain.enums.RoomType;
import com.movie.movie.dtos.RoomDto;
import com.movie.movie.dtos.RoomRequest;
import com.movie.movie.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomDto> create(
            @RequestBody RoomRequest roomRequest
    ){
        RoomDto dto = roomService.create(roomRequest);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<RoomDto> getById(
            @PathVariable(name = "id") Long id
    ){
        RoomDto dto = roomService.getById(id);
        return ResponseEntity.ok().body(dto);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<RoomDto>> getAll(){
        List<RoomDto> rooms = roomService.getAll();
        return ResponseEntity.ok().body(rooms);
    }

    @GetMapping("/name")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<RoomDto> getByName(
            @RequestParam(name = "name") String name
    ){
        RoomDto dto = roomService.getByName(name);
        return ResponseEntity.ok().body(dto);
    }

    @GetMapping("/type")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<RoomDto>> findByRoomType(
            @RequestParam(name = "roomType") RoomType roomType
    ){
        List<RoomDto> rooms = roomService.findByRoomType(roomType);
        return ResponseEntity.ok().body(rooms);
    }
}