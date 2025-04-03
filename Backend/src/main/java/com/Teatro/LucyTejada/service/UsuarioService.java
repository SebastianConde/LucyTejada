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

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UserRepository userRepository;
    private final EmailService emailService;

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
        String link = "http://localhost:8080/api/lucyTejada/registrar/completar?email=" + request.getCorreoElectronico();
        String mensaje = "Hola " + request.getNombres() + ", completa tu registro aquí: " + link;
        emailService.enviarCorreo(request.getCorreoElectronico(), "Completa tu registro", mensaje);
    }
}