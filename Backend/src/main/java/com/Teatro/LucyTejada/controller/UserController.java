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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.Teatro.LucyTejada.dto.CompletarRegistroRequest;
import com.Teatro.LucyTejada.service.JwtService;
import com.Teatro.LucyTejada.dto.RecuperarContrasenaRequest;
import com.Teatro.LucyTejada.dto.RecuperarContrasenaFinalRequest;
import com.Teatro.LucyTejada.dto.EdicionRequest;
import com.Teatro.LucyTejada.dto.EliminacionRequest;

import lombok.RequiredArgsConstructor;
import java.util.Map;

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
    public ResponseEntity<Map<String, String>> registrarUsuario(@RequestBody RegistroRequest request) {
        try {
            usuarioService.registrarUsuario(request);
            return ResponseEntity.ok(Map.of("mensaje","Usuario registrado correctamente."));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje","Error: Datos duplicados o restricción de integridad."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensaje","Error interno del servidor: " + e.getMessage()));
        }
    }

    @PostMapping("/lucyTejada/registrar/completar")
    public ResponseEntity<Map<String, String>> completarRegistro(
            @RequestParam("token") String token,
            @RequestBody(required = false) CompletarRegistroRequest request) {

        try {
            String email = jwtService.extractEmailFromToken(token);

            if (email == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje","Token inválido."));
            }

            // Si no hay datos en el cuerpo, solo valida el token
            if (request == null) {
                return ResponseEntity.ok(Map.of("mensaje","Token válido. Su correo es: " + email + ". Aquí puede completar el registro."));
            }

            // Si hay datos en el cuerpo, completa el registro
            usuarioService.completarRegistro(email, request);
            return ResponseEntity.ok(Map.of("mensaje", "Registro completado con éxito."));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("mensaje",e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensaje", "Error al completar el registro."));
        }
    }

    @PostMapping("/lucyTejada/recuperar-contrasena")
    public ResponseEntity<Map<String, String>> recuperarContrasena(@RequestBody RecuperarContrasenaRequest request) {
        try {
            String correo = request.getCorreoElectronico();
            usuarioService.recuperarContrasena(correo);
            return ResponseEntity.ok(Map.of("mensaje","Correo de recuperación enviado."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("mensaje","Error al enviar el correo de recuperación."));
        }
    }

    @PutMapping("/lucyTejada/recuperar-contrasena/terminar")
    public ResponseEntity<Map<String, String>> completarRecuperacionContrasena(
            @RequestParam("token") String token,
            @RequestBody RecuperarContrasenaFinalRequest request) {
        try {
            String email = jwtService.extractEmailFromToken(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje","Token inválido."));
            }
            usuarioService.completarRecuperacionContrasena(email, request.getNuevaContrasena());
            return ResponseEntity.ok(Map.of("mensaje","Contraseña actualizada con éxito."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("mensaje",e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("mensaje","Error al completar la recuperación de contraseña."));
        }
    }

    @PutMapping("/lucyTejada/editar")
    @PreAuthorize("hasRole('Administrativo')")
    public ResponseEntity<Map<String, String>> editarUsuario(@RequestBody EdicionRequest request) {
        try {
            usuarioService.editarUsuario(request);
            return ResponseEntity.ok(Map.of("mensaje","Usuario editado correctamente."));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje","Error: Datos duplicados o restricción de integridad."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensaje","Error interno del servidor: " + e.getMessage()));
        }
    }

    @DeleteMapping("/lucyTejada/eliminar")
    @PreAuthorize("hasRole('Administrativo')")
    public ResponseEntity<Map<String, String>> eliminarUsuario(@RequestBody EliminacionRequest request) {
        try {
            usuarioService.eliminarUsuario(request);
            return ResponseEntity.ok(Map.of("mensaje","Usuario eliminado correctamente."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensaje","Error al eliminar el usuario."));
        }
    }

    @GetMapping("/lucyTejada/usuarios")
    @PreAuthorize("hasRole('Administrativo') or hasRole('Coordinador')")
    public ResponseEntity<?> obtenerUsuarios() {
        try {
            return ResponseEntity.ok(usuarioService.obtenerUsuarios());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensaje","Error al obtener los usuarios."));
        }
    }

    @GetMapping("/lucyTejada/mi-perfil")
    public ResponseEntity<?> obtenerMiPerfil(@RequestParam("token") String token) {
        try {
            String email = jwtService.extractEmailFromToken(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje","Token inválido."));
            }
            return ResponseEntity.ok(usuarioService.obtenerMiPerfil(email));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensaje","Error al obtener el perfil."));
        }
    }
}