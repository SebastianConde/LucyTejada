package com.Teatro.LucyTejada.controller;

import com.Teatro.LucyTejada.entity.Cursos;
import com.Teatro.LucyTejada.service.CursosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Teatro.LucyTejada.dto.CreacionCursoRequest;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;
import com.Teatro.LucyTejada.dto.CursoConInstructorDTO;

@RestController
@RequestMapping("/api")
public class CursosController {

    @Autowired
    private CursosService cursosService;

    // Crear un nuevo curso
    @PostMapping("/lucyTejada/crear-curso")
    @PreAuthorize("hasRole('Coordinador')")
    public ResponseEntity<Map<String,String>> crearCurso(@RequestBody CreacionCursoRequest creacionCursoRequest) {
        try {
            cursosService.crearCurso(creacionCursoRequest);
            return ResponseEntity.ok(Map.of("mensaje","Curso creado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("mensaje", "Error interno del servidor."));
        }
    }

    // Modificar un curso existente
    @PutMapping("/lucyTejada/modificar-curso/{id}")
    @PreAuthorize("hasRole('Coordinador')")
    public ResponseEntity<Map<String,String>> modificarCurso(@PathVariable("id") Integer id, @RequestBody CreacionCursoRequest creacionCursoRequest) {
        try {
            cursosService.modificarCurso(id, creacionCursoRequest);
            return ResponseEntity.ok(Map.of("mensaje","Curso modificado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("mensaje", "Error interno del servidor."));
        }
    }

    // Eliminar un curso existente
    @DeleteMapping("/lucyTejada/eliminar-curso/{id}")
    @PreAuthorize("hasRole('Coordinador')")
    public ResponseEntity<Map<String,String>> eliminarCurso(@PathVariable("id") Integer id) {
        try {
            cursosService.eliminarCurso(id);
            return ResponseEntity.ok(Map.of("mensaje","Curso eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("mensaje", "Error interno del servidor."));
        }
    }

    // Obtener todos los cursos
    @GetMapping("/lucyTejada/cursos")
    @PreAuthorize("hasRole('Coordinador')")
    public ResponseEntity<?> obtenerCursos() {
        try {
            List<CursoConInstructorDTO> cursos = cursosService.obtenerCursos();
            return ResponseEntity.ok(cursos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("mensaje", "Error interno del servidor."));
        }
    }

    // Obtener un curso por ID
    @GetMapping("/lucyTejada/curso/{id}")
    @PreAuthorize("hasRole('Coordinador')")
    public ResponseEntity<?> obtenerCursoPorId(@PathVariable("id") Integer id) {
        try {
            Cursos curso = cursosService.obtenerCursoPorId(id);
            return ResponseEntity.ok(curso);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("mensaje", "Error interno del servidor."));
        }
    }

    // Obtener cursos por instructor
    @GetMapping("/lucyTejada/cursos/instructor/{instructorId}")
    @PreAuthorize("hasRole('Coordinador')")
    public ResponseEntity<?> obtenerCursosPorInstructor(@PathVariable("instructorId") Integer instructorId) {
        try {
            List<Cursos> cursos = cursosService.obtenerCursosPorInstructor(instructorId);
            return ResponseEntity.ok(cursos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("mensaje", "Error interno del servidor."));
        }
    }

    // Obtener mis cursos como instructor
    @GetMapping("/lucyTejada/mis-cursos")
    @PreAuthorize("hasRole('Instructor')")
    public ResponseEntity<?> obtenerMisCursosComoInstructor(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            List<Cursos> cursos = cursosService.obtenerMisCursosComoInstructor(token);
            return ResponseEntity.ok(cursos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("mensaje", "Error interno del servidor."));
        }
    }
}
