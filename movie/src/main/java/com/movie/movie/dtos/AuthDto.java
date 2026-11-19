package com.movie.movie.dtos;

import com.movie.movie.domain.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthDto {
    private String token;
    private User user;
}
