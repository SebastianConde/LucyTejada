package com.Teatro.LucyTejada.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.Teatro.LucyTejada.service.UsuarioService;
import com.Teatro.LucyTejada.dto.RegistroRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LucyTejadaController {

    private final UsuarioService usuarioService;

    @PostMapping("/lucyTejada")
    public String welcome() {
        return "Bienvenido al endpoint de Lucy Tejada";
    }

    @PostMapping("/lucyTejada/registrar")
    @PreAuthorize("hasRole('ROLE_Administrativo')")  // Se usa con "ROLE_"
    public ResponseEntity<String> registrarUsuario(@RequestBody RegistroRequest request) {
        usuarioService.registrarUsuario(request);
        return ResponseEntity.ok("Usuario registrado correctamente.");
    }
}