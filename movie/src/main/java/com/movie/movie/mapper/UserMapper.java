package com.movie.movie.mapper;

import com.movie.movie.domain.User;
import com.movie.movie.dtos.UserDto;
import com.movie.movie.dtos.UserRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toEntity(UserRequest userRequest);

    UserDto toDto(User user);
}
