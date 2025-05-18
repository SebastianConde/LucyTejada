package com.Teatro.LucyTejada.controller;

import com.Teatro.LucyTejada.entity.Cursos;
import com.Teatro.LucyTejada.service.CursosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Teatro.LucyTejada.dto.CreacionCursoRequest;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CursosController {

    @Autowired
    private CursosService cursosService;

    // Crear un nuevo curso
    @PostMapping("/lucyTejada/crear-curso")
    @PreAuthorize("hasRole('Coordinador')")
    public ResponseEntity<String> crearCurso(@RequestBody CreacionCursoRequest creacionCursoRequest) {
        try {
            cursosService.crearCurso(creacionCursoRequest);
            return ResponseEntity.ok("Curso creado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
