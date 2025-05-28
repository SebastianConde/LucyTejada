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
import java.util.Map;
import java.lang.Boolean;
import java.lang.String;

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
    public ResponseEntity<Map<String,String>> registrarEstudiante(@RequestBody RegistroEstudianteRequest request) {
        try {
            estudianteService.registrarEstudiante(request);
            return ResponseEntity.ok(Map.of("mensaje","Estudiante registrado correctamente."));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje","Error: Datos duplicados o restricción de integridad."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensaje","Error interno del servidor: " + e.getMessage()));
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
    public ResponseEntity<Map<String,String>> eliminarEstudiante(@PathVariable("id") Integer id) {
        try {
            estudianteService.eliminarEstudiante(id);
            return ResponseEntity.ok(Map.of("mensaje","Estudiante eliminado correctamente."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensaje","Error interno del servidor: " + e.getMessage()));
        }
    }

    // Identificar si existe un estudiante por documento
    @GetMapping("/lucyTejada/estudiante-existe")
    @PreAuthorize("hasRole('Instructor')")
    public ResponseEntity<?> estudianteExiste(@RequestParam String documento) {
        try {
            boolean existe = estudianteService.estudianteExiste(documento);
            return ResponseEntity.ok(Map.of("existe", existe));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensaje", "Error interno del servidor: " + e.getMessage()));
        }
    }

    //Inscribir un estudiante a un curso por medio de documento y de curso
    @PostMapping("/lucyTejada/inscribir-estudiante")
    @PreAuthorize("hasRole('Instructor')")
    public ResponseEntity<Map<String,String>> inscribirEstudiante(@RequestParam String documento, @RequestParam String curso) {
        try {
            estudianteService.inscribirEstudiante(documento, curso);
            return ResponseEntity.ok(Map.of("mensaje","Estudiante inscrito correctamente."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("mensaje","Error interno del servidor: " + e.getMessage()));
        }
    }

}