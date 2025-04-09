package com.Teatro.LucyTejada.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Date;
import java.security.Key;

import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import java.util.function.Function;
import com.Teatro.LucyTejada.entity.Usuario;


@Service
public class JwtService {

    private static final String SECRET_KEY = "TXV5U2VndXJhQ2xhdmVEZTMyQ2FyYWN0ZXJlc09tYXMxMjM=";
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String getToken(UserDetails usuario) {
        Map<String, Object> extraClaims = new HashMap<>();

        // Agregar el rol al token (asumiendo que el usuario tiene al menos un rol)
        String rol = usuario.getAuthorities().stream()
                .findFirst()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .orElse("ROLE_");

        extraClaims.put("rol", rol);

        if (usuario instanceof Usuario) {
            boolean primerInicio = ((Usuario) usuario).getPrimerInicioSesion();
            extraClaims.put("primer_inicio_sesion", primerInicio);
        }

        return getToken(extraClaims, usuario);
    }

    private String getToken( Map<String,Object> extraClaims, UserDetails usuario) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(usuario.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24 * 60))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateEmailToken(String correo) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(correo)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 1 día
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmailFromToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    public String extractRolFromToken(String token) { return getAllClaims(token).get("rol", String.class); }

    public boolean extractPrimerInicioSesionFromToken(String token) { return getAllClaims(token).get("primer_inicio_sesion", Boolean.class); }

    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getUsernameFromToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Claims getAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Date getExpiration(String token) {
        return getClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return getExpiration(token).before(new Date());
    }

    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

}

