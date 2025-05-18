package com.Teatro.LucyTejada.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.Teatro.LucyTejada.dto.RegistroRequest;
import com.Teatro.LucyTejada.entity.Usuario;
import com.Teatro.LucyTejada.repository.UserRepository;
import com.Teatro.LucyTejada.service.EmailService;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import com.Teatro.LucyTejada.dto.CompletarRegistroRequest;
import com.Teatro.LucyTejada.service.JwtService;
import com.Teatro.LucyTejada.dto.EdicionRequest;
import com.Teatro.LucyTejada.dto.EliminacionRequest;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtService jwtService;


    @Value("${app.url.base}")
    private String baseUrl;

    @Value("${app.url.front}")
    private String frontUrl;

    public void registrarUsuario(RegistroRequest request) {
        Usuario usuario = new Usuario();
        usuario.setCedula(request.getCedula());
        usuario.setNombres(request.getNombres());
        usuario.setApellidos(request.getApellidos());
        usuario.setCorreoElectronico(request.getCorreoElectronico());
        usuario.setContrasena(UUID.randomUUID().toString()); // Genera una clave aleatoria
        usuario.setRol(request.getRol());
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        usuario.setDireccion(request.getDireccion());
        usuario.setTelefono(request.getTelefono());
        usuario.setSexo(request.getSexo());
        usuario.setTipoSangre(request.getTipoSangre());

        // Guardar el usuario
        userRepository.save(usuario);

        // Enviar correo con enlace para completar el registro
        String token = jwtService.generateEmailToken(request.getCorreoElectronico());
        String link = frontUrl + "/completar-registro?token=" + token;
        String mensaje = "Hola " + request.getNombres() + ", completa tu registro aquí: " + link;
        emailService.enviarCorreo(request.getCorreoElectronico(), "Completa tu registro", mensaje);
    }

    public void completarRegistro(String email, CompletarRegistroRequest request) {
        Optional<Usuario> optionalUsuario = userRepository.findByCorreoElectronico(email);
        if (optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();

            // Solo actualiza si el campo actual es null y el nuevo valor no es null ni vacío
            if (usuario.getFechaNacimiento() == null && request.getFechaNacimiento() != null) {
                usuario.setFechaNacimiento(request.getFechaNacimiento());
            }

            if (usuario.getDireccion() == null && request.getDireccion() != null && !request.getDireccion().isBlank()) {
                usuario.setDireccion(request.getDireccion());
            }

            if (usuario.getTelefono() == null && request.getTelefono() != null && !request.getTelefono().isBlank()) {
                usuario.setTelefono(request.getTelefono());
            }

            if (usuario.getSexo() == null && request.getSexo() != null) {
                usuario.setSexo(request.getSexo());
            }

            if (usuario.getTipoSangre() == null && request.getTipoSangre() != null && !request.getTipoSangre().isBlank()) {
                usuario.setTipoSangre(request.getTipoSangre());
            }

            // Actualiza la contraseña si viene una nueva válida
            if (request.getContrasena() != null && !request.getContrasena().isBlank()) {
                String hashedPassword = jwtService.hashPassword(request.getContrasena());
                usuario.setContrasena(hashedPassword);
            }

            usuario.setPrimerInicioSesion(false);
            userRepository.save(usuario);
        } else {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
    }

    public void recuperarContrasena(String correoElectronico) {
        System.out.println("Recuperar contraseña para el correo: " + correoElectronico);
        Optional<Usuario> usuarioOptional = userRepository.findByCorreoElectronico(correoElectronico);
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            String token = jwtService.generateEmailToken(correoElectronico);
            String link = frontUrl + "/recuperar-password/terminar?token=" + token;
            String mensaje = "Hola " + usuario.getNombres() + ", restablece tu contraseña aquí: " + link;
            emailService.enviarCorreo(correoElectronico, "Restablecer contraseña", mensaje);
        } else {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
    }

    public void completarRecuperacionContrasena(String email, String nuevaContrasena) {
        Optional<Usuario> usuarioOptional = userRepository.findByCorreoElectronico(email);
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            String hashedPassword = jwtService.hashPassword(nuevaContrasena);
            usuario.setContrasena(hashedPassword);
            userRepository.save(usuario);
        } else {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
    }

    public void editarUsuario(EdicionRequest request) {
        Optional<Usuario> usuarioOpt = userRepository.findByCorreoElectronico(request.getCorreoElectronico());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            if (request.getNombres() != null) usuario.setNombres(request.getNombres());
            if (request.getApellidos() != null) usuario.setApellidos(request.getApellidos());
            if (request.getDireccion() != null) usuario.setDireccion(request.getDireccion());
            if (request.getFechaNacimiento() != null) usuario.setFechaNacimiento(request.getFechaNacimiento());
            if (request.getTelefono() != null) usuario.setTelefono(request.getTelefono());
            if (request.getSexo() != null) usuario.setSexo(request.getSexo());
            if (request.getTipoSangre() != null) usuario.setTipoSangre(request.getTipoSangre());
            if (request.getRol() != null) usuario.setRol(request.getRol());

            // ¡NO se actualiza el correo!
            userRepository.save(usuario);
        } else {
            throw new RuntimeException("Usuario no encontrado con correo: " + request.getCorreoElectronico());
        }
    }

    public void eliminarUsuario(EliminacionRequest request) {
        Optional<Usuario> usuarioOpt = userRepository.findByCedula(request.getCedula());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            userRepository.delete(usuario);
        } else {
            throw new RuntimeException("Usuario no encontrado con cédula: " + request.getCedula());
        }
    }

    public List<Usuario> obtenerUsuarios() {
        return userRepository.findAll();
    }

    public Usuario obtenerMiPerfil(String correoElectronico) {
        return userRepository.findByCorreoElectronico(correoElectronico)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con correo: " + correoElectronico));
    }
}