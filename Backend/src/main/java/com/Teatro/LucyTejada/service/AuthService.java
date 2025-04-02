package com.Teatro.LucyTejada.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.Teatro.LucyTejada.dto.AuthResponse;
import com.Teatro.LucyTejada.dto.LoginRequest;
import com.Teatro.LucyTejada.repository.UserRepository;
import com.Teatro.LucyTejada.service.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.Teatro.LucyTejada.entity.Usuario;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    // Implementación del servicio de autenticación
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            System.out.println("✅ Autenticación exitosa para el usuario: " + request.getUsername());
        } catch (Exception e) {
            System.out.println("❌ Error en la autenticación: " + e.getMessage());
            throw e;
        }

        Usuario user = userRepository.findByCorreoElectronico(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // Cambiar estado del primer inicio de sesión
        if (user.getPrimerInicioSesion()) {
            user.setPrimerInicioSesion(false);
            userRepository.save(user);
        }

        String token = jwtService.getToken(user);
        return AuthResponse.builder()
                .token(token)
                .build();
    }

}