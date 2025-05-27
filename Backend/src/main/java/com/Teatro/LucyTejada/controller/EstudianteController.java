package com.Teatro.LucyTejada.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.Teatro.LucyTejada.service.EstudianteService;
import org.springframework.http.HttpStatus;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.Teatro.LucyTejada.service.JwtService;
import com.Teatro.LucyTejada.dto.RegistroEstudianteRequest;
import com.Teatro.LucyTejada.entity.Estudiante;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import com.Teatro.LucyTejada.dto.EstudianteConCursosResponse;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EstudianteController {

    private final EstudianteService estudianteService;
    private final JwtService jwtService;

    @PostMapping("/lucyTejada/registro-estudiantes")
    @PreAuthorize("hasRole('Instructor')")
    public ResponseEntity<String> registrarEstudiante(@RequestBody RegistroEstudianteRequest request) {
        try {
            estudianteService.registrarEstudiante(request);
            return ResponseEntity.ok("Estudiante registrado correctamente.");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Datos duplicados o restricción de integridad.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor: " + e.getMessage());
        }
    }

    @GetMapping("/lucyTejada/estudiantes")
    @PreAuthorize("hasRole('Instructor')")
    public ResponseEntity<List<EstudianteConCursosResponse>> obtenerEstudiantes(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            List<EstudianteConCursosResponse> estudiantes = estudianteService.obtenerEstudiantes(token);
            return ResponseEntity.ok(estudiantes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/lucyTejada/eliminar-estudiante/{id}")
    @PreAuthorize("hasRole('Instructor')")
    public ResponseEntity<String> eliminarEstudiante(@PathVariable("id") Integer id) {
        try {
            estudianteService.eliminarEstudiante(id);
            return ResponseEntity.ok("Estudiante eliminado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor: " + e.getMessage());
        }
    }
}