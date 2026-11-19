package com.movie.movie.dtos;

import com.movie.movie.domain.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String refreshToken;
    private UserRole role;
}
