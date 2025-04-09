package com.Teatro.LucyTejada.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.Teatro.LucyTejada.service.UserService;
import com.Teatro.LucyTejada.dto.RegistroRequest;
import org.springframework.http.HttpStatus;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.Teatro.LucyTejada.dto.CompletarRegistroRequest;
import com.Teatro.LucyTejada.service.JwtService;
import com.Teatro.LucyTejada.dto.RecuperarContrasenaRequest;
import com.Teatro.LucyTejada.dto.RecuperarContrasenaFinalRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService usuarioService;
    private final JwtService jwtService;

    @PostMapping("/lucyTejada")
    public String welcome() {
        return "Bienvenido al endpoint de Lucy Tejada";
    }

    @PostMapping("/lucyTejada/registrar")
    @PreAuthorize("hasRole('Administrativo')")
    public ResponseEntity<String> registrarUsuario(@RequestBody RegistroRequest request) {
        try {
            usuarioService.registrarUsuario(request);
            return ResponseEntity.ok("Usuario registrado correctamente.");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Datos duplicados o restricción de integridad.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor: " + e.getMessage());
        }
    }

    @PostMapping("/lucyTejada/registrar/completar")
    public ResponseEntity<String> completarRegistro(
            @RequestParam("token") String token,
            @RequestBody(required = false) CompletarRegistroRequest request) {

        try {
            String email = jwtService.extractEmailFromToken(token);

            if (email == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido.");
            }

            // Si no hay datos en el cuerpo, solo valida el token
            if (request == null) {
                return ResponseEntity.ok("Token válido. Su correo es: " + email + ". Aquí puede completar el registro.");
            }

            // Si hay datos en el cuerpo, completa el registro
            usuarioService.completarRegistro(email, request);
            return ResponseEntity.ok("Registro completado con éxito.");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al completar el registro.");
        }
    }

    @PostMapping("/lucyTejada/recuperar-contrasena")
    public ResponseEntity<String> recuperarContrasena(@RequestBody RecuperarContrasenaRequest request) {
        try {
            String correo = request.getCorreoElectronico();
            usuarioService.recuperarContrasena(correo);
            return ResponseEntity.ok("Correo de recuperación enviado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al enviar el correo de recuperación.");
        }
    }

    @PutMapping("/lucyTejada/recuperar-contrasena/terminar")
    public ResponseEntity<String> completarRecuperacionContrasena(
            @RequestParam("token") String token,
            @RequestBody RecuperarContrasenaFinalRequest request) {
        try {
            String email = jwtService.extractEmailFromToken(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido.");
            }
            usuarioService.completarRecuperacionContrasena(email, request.getNuevaContrasena());
            return ResponseEntity.ok("Contraseña actualizada con éxito.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al completar la recuperación de contraseña.");
        }
    }
}