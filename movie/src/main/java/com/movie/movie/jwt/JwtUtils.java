package com.movie.movie.jwt;

import com.movie.movie.domain.enums.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtUtils {
    @Value("${jwt.secretKey}")
    private String secretKey;
    @Value("${jwt.expirationAccessToken}")
    private Long expirationAccessToken;
    @Value("${jwt.expirationRefreshToken}")
    private Long expirationRefreshToken;

    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_TYPE = "type";
    private static final String TYPE_ACCESS = "access";
    private static final String TYPE_REFRESH = "refresh";

    private SecretKey getSigned(){
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateAccessToken(String email, UserRole role){
        return Jwts.builder()
                .signWith(getSigned())
                .subject(email)
                .claim(CLAIM_ROLE, role.name())
                .claim(CLAIM_TYPE, TYPE_ACCESS)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+expirationAccessToken))
                .compact();
    }

    public String generateRefreshToken(String email){
        return Jwts.builder()
                .signWith(getSigned())
                .subject(email)
                .claim(CLAIM_TYPE, TYPE_REFRESH)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+expirationRefreshToken))
                .compact();
    }

    private Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(getSigned())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token){
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token){
        return extractAllClaims(token).get(CLAIM_ROLE, String.class);
    }

    private String extractType(String token){
        return extractAllClaims(token).get(CLAIM_TYPE, String.class);
    }

    public boolean isTokenExpired(String token){
        try {
            return extractAllClaims(token).getExpiration().before(new Date());
        } catch (ExpiredJwtException e){
            return true;
        }
    }

    public boolean isAccessToken(String token){
        return TYPE_ACCESS.equals(extractType(token));
    }

    public boolean isRefreshToken(String token){
        return TYPE_REFRESH.equals(extractType(token));
    }

    public boolean validateToken(String token){
        try {
            return !isTokenExpired(token);
        } catch (Exception e){
            return false;
        }
    }
}