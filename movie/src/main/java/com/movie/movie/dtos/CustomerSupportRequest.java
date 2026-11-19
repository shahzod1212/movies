package com.movie.movie.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CustomerSupportRequest {
    private String username;
    private String email;
    private String subject;
    private String message;
}
