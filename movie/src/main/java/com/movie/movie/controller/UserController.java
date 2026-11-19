package com.movie.movie.controller;

import com.movie.movie.dtos.AuthDto;
import com.movie.movie.dtos.UserDto;
import com.movie.movie.dtos.UserLoginRequest;
import com.movie.movie.dtos.UserRequest;
import com.movie.movie.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthDto> register(
            @RequestBody UserRequest userRequest
    ) {
        AuthDto dto = userService.register(userRequest);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDto> login(
            @RequestBody UserLoginRequest userLoginRequest
    ) {
        AuthDto dto = userService.login(userLoginRequest);
        return ResponseEntity.ok().body(dto);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthDto> refreshToken(
            @RequestParam String refreshToken
    ) {
        AuthDto dto = userService.refreshToken(refreshToken);
        return ResponseEntity.ok().body(dto);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> search(
            @RequestParam String keyword
    ) {
        List<UserDto> users = userService.search(keyword);
        return ResponseEntity.ok().body(users);
    }
}