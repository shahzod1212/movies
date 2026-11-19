package com.movie.movie.service.Impl;

import com.movie.movie.domain.User;
import com.movie.movie.domain.enums.UserRole;
import com.movie.movie.dtos.AuthDto;
import com.movie.movie.dtos.UserDto;
import com.movie.movie.dtos.UserLoginRequest;
import com.movie.movie.dtos.UserRequest;
import com.movie.movie.jwt.JwtUtils;
import com.movie.movie.mapper.UserMapper;
import com.movie.movie.repository.UserRepository;
import com.movie.movie.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Override
    public AuthDto register(UserRequest userRequest) {
        User existing = userRepository.findByEmail(userRequest.getEmail());

        if (existing != null) {
            throw new IllegalArgumentException("A user with this email already exists.");
        }

        User user = userMapper.toEntity(userRequest);

        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setRole(UserRole.USER);

        String accessToken = jwtUtils.generateAccessToken(user.getEmail(), UserRole.USER);
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

        user.setRefreshToken(refreshToken);

        User saved = userRepository.save(user);

        return new AuthDto(accessToken, saved);
    }

    @Override
    public AuthDto login(UserLoginRequest userLoginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userLoginRequest.getEmail(),
                        userLoginRequest.getPassword()
                )
        );

        User user = userRepository.findByEmail(userLoginRequest.getEmail());

        String accessToken = jwtUtils.generateAccessToken(user.getEmail(), user.getRole());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return new AuthDto(accessToken, user);
    }

    @Override
    public List<UserDto> search(String keyword) {
        List<User> users = userRepository.findByEmailContaining(keyword);

        return users.stream()
                .map(userMapper::toDto)
                .toList();
    }

    @Override
    public AuthDto refreshToken(String refreshToken) {
        String email;
        boolean expired;

        try {
            email = jwtUtils.extractEmail(refreshToken);
            expired = jwtUtils.isTokenExpired(refreshToken);
        } catch (ExpiredJwtException e) {
            email = e.getClaims().getSubject();
            expired = true;
        }

        User user = userRepository.findByEmail(email);

        if (user == null || !refreshToken.equals(user.getRefreshToken())) {
            throw new IllegalArgumentException("Refresh token not recognized.");
        }

        if (expired) {
            String newRefreshToken = jwtUtils.generateRefreshToken(email);
            String newAccessToken = jwtUtils.generateAccessToken(email, user.getRole());

            user.setRefreshToken(newRefreshToken);
            userRepository.save(user);

            return new AuthDto(newAccessToken, user);
        }

        String accessToken = jwtUtils.generateAccessToken(email, user.getRole());

        return new AuthDto(accessToken, user);
    }
}