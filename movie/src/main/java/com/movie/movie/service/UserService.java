package com.movie.movie.service;

import com.movie.movie.dtos.AuthDto;
import com.movie.movie.dtos.UserDto;
import com.movie.movie.dtos.UserLoginRequest;
import com.movie.movie.dtos.UserRequest;

import java.util.List;

public interface UserService {

    AuthDto register(UserRequest userRequest);

    AuthDto login(UserLoginRequest userLoginRequest);

    List<UserDto> search(String keyword);

    AuthDto refreshToken(String refreshToken);
}
